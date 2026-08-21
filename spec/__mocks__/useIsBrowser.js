// `@docusaurus/useIsBrowser` is an alias Docusaurus resolves at build time, not
// a package on disk, so jest cannot resolve it. Mapped here so components using
// it are testable at all — ThemeSelector has no spec for exactly this reason.
//
// Defaults to true (the post-hydration case). A spec that needs the SSR/first-
// render side overrides it with jest.mock.
module.exports = { __esModule: true, default: () => true };
