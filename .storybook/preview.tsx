import { tokens } from '@equinor/eds-tokens';

import { Preview } from '@storybook/react';

const { colors } = tokens;

export const globalTypes = {
  dataThemes: {
    defaultValue: {
      list: [
        { name: 'Light', dataTheme: 'light', color: '#FFFFFF' },
        { name: 'Dark', dataTheme: 'dark', color: '#243746' },
      ],
    },
  },
};

export const parameters = {
  actions: { argTypes: /^on[A-Z].*/ },
  viewMode: 'docs',
  backgrounds: {
    default: 'Equinor UI Light (off-white/off-dark)',
    values: [
      {
        name: 'Equinor UI Light (off-white/off-dark)',
        value: colors.ui.background__light.rgba,
      },
      {
        name: 'Equinor UI Default (white/dark)',
        value: colors.ui.background__default.rgba,
      },
    ],
  },
};

const preview: Preview = {};

export default preview;
