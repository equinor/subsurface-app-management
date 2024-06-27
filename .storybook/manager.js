import { addons } from '@storybook/addons';
import amplifyTheme from '.storybook/samTheme';

addons.setConfig({
  theme: amplifyTheme,
  panelPosition: 'right',
  selectedPanel: 'STORYBOOK_ADDON_DESIGNS/panel',
});
