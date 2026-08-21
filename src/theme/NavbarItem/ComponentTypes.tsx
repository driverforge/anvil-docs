import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import ThemeSelector from '../../components/ThemeSelector';
import SignInNavbarItem from '../../components/SignInNavbarItem';

// Register the custom navbar item types used in docusaurus.config.ts.
// https://docusaurus.io/docs/api/themes/configuration#navbar-custom-items
export default {
  ...ComponentTypes,
  'custom-themeSelector': ThemeSelector,
  'custom-signIn': SignInNavbarItem,
};
