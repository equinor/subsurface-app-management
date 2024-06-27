import { Typography } from '@equinor/eds-core-react';
import { Meta, StoryFn } from '@storybook/react';

import styled from 'styled-components';

const hookList = [
  {
    name: 'useSignalRMessages',
    body: 'Returns service bus messages with wss given a topic + host + token',
    code: `const {
     messages,
     hasUnreadMessages,
     setMessageAsRead,
     setAllMessagesAsRead,
     deleteMessage } = useSignalRMessages<MessageDto>('recap_notifications', 'url', 'token')`,
  },
  {
    name: 'useFeatureToggling',
    body: 'Returns if a given key should be feature toggled on/off',
    code: 'const { showContent, isLoading } = useFeatureToggling("analytics")',
  },
  {
    name: 'useAuth',
    body: 'Returns auth object from AuthProvider',
    code: 'const { account } = useAuth()',
  },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  > div {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  code {
    background: #3d3d3d;
    padding: 24px;
    color: white;
    font-family: monospace;
    display: block;
    white-space: pre-wrap;
  }
`;

const Divider = styled.hr`
  height: 1px;
  background: #3d3d3d;
  width: 100%;
  border: none;
`;

const List = () => (
  <Container>
    <div>
      <Typography variant="h1">List of all hooks</Typography>
      <Divider />
    </div>
    {hookList.map((hook) => (
      <Content key={hook.name}>
        <div>
          <Typography variant="h3">{hook.name}</Typography>-
          <Typography>{hook.body}</Typography>
        </div>
        <code>{hook.code}</code>
      </Content>
    ))}
  </Container>
);

export default {
  title: 'Hooks',
  component: List,
} as Meta;

export const Primary: StoryFn = () => <List />;
