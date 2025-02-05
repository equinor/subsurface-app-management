import { Meta } from '@storybook/react';

import styled from 'styled-components';

const providersList = [
  {
    name: 'FeatureToggleProvider',
    body: 'Provider needed to use feature toggle hook',
    code: `<FeatureToggleProvider>
    {children}
</FeatureToggleProvider>`,
  },
  {
    name: 'TutorialProvider',
    body: 'Provider needed to use tutorial hook',
    code: `<TutorialProvider>
    {children}
</TutorialProvider>`,
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

export const Docs = () => (
  <Container>
    <div>
      <h1>List of all providers</h1>
      <Divider />
    </div>
    {providersList.map((provider) => (
      <Content key={provider.name}>
        <div>
          <h3>{provider.name}</h3>-<p>{provider.body}</p>
        </div>
        <code>{provider.code}</code>
      </Content>
    ))}
  </Container>
);

export default {
  title: 'Providers',
  component: Docs,
} as Meta;
