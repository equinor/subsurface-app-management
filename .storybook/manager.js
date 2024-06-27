import { addons } from '@storybook/addons';
import samTheme from './samTheme';

addons.setConfig({
  theme: samTheme,
  panelPosition: 'right',
  selectedPanel: 'STORYBOOK_ADDON_DESIGNS/panel',
});
