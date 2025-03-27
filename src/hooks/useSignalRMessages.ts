import { useEffect, useMemo, useRef, useState } from 'react';

import * as SignalR from '@microsoft/signalr';
import { LogLevel } from '@microsoft/signalr';
import { HubConnection } from '@microsoft/signalr/dist/esm/HubConnection';
import { useQuery } from '@tanstack/react-query';

import { getJSEmbarkToken } from 'src/api';
import { EnvironmentType } from 'src/types/Environment';
import { getEnvironmentName } from 'src/utils/environment';

/* v8 ignore start */
export function useSignalRMessages<
  T extends {
    SequenceNumber?: number | null;
    Read?: boolean | null;
    Subject?: string | null;
  },
>(topic: string) {
  const connectionRef = useRef<HubConnection | undefined>(undefined);
  const [messages, setMessages] = useState<T[]>([]);
  const [deletedMessageSequenceNumber, setDeletedMessageSequenceNumber] =
    useState<number>();
  const [updateMessage, setUpdateMessage] = useState<T>();
  const previousTopic = useRef<string | undefined>(undefined);
  const previousToken = useRef<string | undefined>(undefined);

  const { data: token } = useQuery({
    queryKey: ['get-amplify-portal-token'],
    queryFn: () => getJSEmbarkToken(),
  });

  const host = useMemo(() => {
    const environmentName = getEnvironmentName(
      import.meta.env.VITE_ENVIRONMENT_NAME
    );

    const environmentNameForUrl =
      environmentName === EnvironmentType.LOCALHOST
        ? EnvironmentType.DEVELOP
        : environmentName;

    return `wss://api-amplify-portal-${environmentNameForUrl}.radix.equinor.com`;
  }, []);

  useEffect(() => {
    async function setupConnection() {
      if (
        token === undefined ||
        (previousTopic.current === topic && previousToken.current === token)
      ) {
        return;
      }

      if (
        connectionRef.current !== undefined &&
        previousTopic.current &&
        previousToken.current &&
        (previousTopic.current !== topic || previousToken.current !== token)
      ) {
        await connectionRef.current.stop();
      }

      previousToken.current = token;
      previousTopic.current = topic;

      const connection = new SignalR.HubConnectionBuilder()
        .configureLogging(LogLevel.Error)
        .withUrl(`${host}/hubs/notifications`, {
          accessTokenFactory: () => token,
          withCredentials: false,
          skipNegotiation: true,
          transport: SignalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build();

      try {
        await connection.start();

        /* receive messages */
        connection.on(
          'ActiveMessages',
          (subject: string, activeMessages: T[]) => {
            setMessages(
              activeMessages.map((d) => ({ ...d, Subject: subject })).reverse()
            );
          }
        );

        /* connect to a topic */
        connection.onreconnected(() => connection.invoke('Subscribe', topic));

        /* receive one new message from the servicebus */
        connection.on('NewMessage', (subject: string, message: T) => {
          setMessages((ct) => [{ ...message, Subject: subject }, ...ct]);
        });

        /* update a message */
        connection.on('UpdateMessage', (subject: string, message: T) => {
          /**
           * you cant get the value of state variables inside connection.on()
           * but you can still set state.
           * this uses another useEffect by setting a temp state that updates the message state.
           */
          setUpdateMessage({ ...message, Subject: subject });
        });

        /* delete a message from servicebus */
        connection.on(
          'Delete',
          (subject: string, messageSequenceNumber: number) => {
            /**
             * you cant get the value of state variables inside connection.on()
             * but you can still set state.
             * this uses another useEffect by setting a temp state that updates the messages state.
             */
            setDeletedMessageSequenceNumber(messageSequenceNumber);
          }
        );

        /* print error to console */
        connection.on('Error', (msg: string) => {
          throw new Error('Connection error: ' + msg);
        });

        /* connect to a topic */
        await connection.invoke('Subscribe', topic);

        /* Get all active messages */
        await connection.invoke('PeekMessages');
      } catch (error) {
        console.error('Connection failed', error);
      }
      connectionRef.current = connection;
    }

    setupConnection().catch((error) => {
      console.error('Error setting up connection', error);
    });
  }, [host, topic, token]);

  // Update notification useeffect
  useEffect(() => {
    if (updateMessage) {
      const updateMessageIndex = messages.findIndex(
        (x) => x.SequenceNumber === updateMessage.SequenceNumber
      );
      const tempNotifications = [...messages];
      if (updateMessageIndex > -1) {
        tempNotifications[updateMessageIndex] = updateMessage;
        setMessages(tempNotifications);
        setUpdateMessage(undefined);
      }
    }
  }, [updateMessage, messages]);

  // Delete notification useEffect
  useEffect(() => {
    /* remove notification from state */
    if (deletedMessageSequenceNumber) {
      const removeNotificationIndex = messages.findIndex(
        (x) => x.SequenceNumber === deletedMessageSequenceNumber
      );
      const tempNotifications = [...messages];
      if (removeNotificationIndex > -1) {
        tempNotifications.splice(removeNotificationIndex, 1);
        setMessages(tempNotifications);
        setDeletedMessageSequenceNumber(undefined);
      }
    }
  }, [deletedMessageSequenceNumber, messages]);

  async function deleteMessage(message: T) {
    if (connectionRef.current && message.SequenceNumber !== null) {
      await connectionRef.current.invoke(
        'DeleteMessage',
        message.SequenceNumber
      );
      setDeletedMessageSequenceNumber(message.SequenceNumber);
    }
  }

  const setMessageAsRead = (message: T) => {
    if (connectionRef.current) {
      message.Read = !message.Read;
      connectionRef.current
        .invoke('PatchMessage', message.SequenceNumber, message)
        .catch((error) => {
          console.error('Error setting message as read', error);
        });
    }
  };

  const setAllMessagesAsRead = () => {
    messages.forEach((no) => {
      if (!no.Read) {
        setMessageAsRead(no);
      }
    });
  };

  const hasUnreadMessages = useMemo(() => {
    return messages.some((no) => no.Read === false);
  }, [messages]);

  const closeConnection = async () => {
    if (connectionRef.current) {
      return await connectionRef.current.stop();
    }
    return;
  };

  return {
    messages,
    hasUnreadMessages,
    setMessageAsRead,
    setAllMessagesAsRead,
    deleteMessage,
    closeConnection,
  };
}
/* v8 ignore end */
