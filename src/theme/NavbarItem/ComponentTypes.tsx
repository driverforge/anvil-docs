import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import ThemeSelector from '../../components/ThemeSelector';

// Register the custom `type: 'custom-themeSelector'` navbar item (see
// docusaurus.config.ts). https://docusaurus.io/docs/api/themes/configuration#navbar-custom-items
export default {
  ...ComponentTypes,
  'custom-themeSelector': ThemeSelector,
};
