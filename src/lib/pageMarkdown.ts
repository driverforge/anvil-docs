// Where a doc page's Markdown copy is served: /cli/init/ -> /cli/init.md, and
// the site root -> /index.md. docusaurus-plugin-llms writes the files at these
// paths (generateMarkdownFiles); the Copy menu reads them and the build check
// in src/plugins/llms.ts holds the two to the same mapping.
export function markdownPathFor(permalink: string): string {
  const route = permalink.replace(/\/+$/, '');
  return `${route || '/index'}.md`;
}

// Every doc page carries the Copy menu except the site root, the docs' home
// page.
export function showsCopyPageMenu(permalink: string): boolean {
  return permalink !== '/';
}

// Carried by the Copy menu's root element, so the build check can confirm the
// menu was rendered into every doc page's HTML that should have it.
export const COPY_PAGE_MENU_MARKER = 'data-copy-page-menu';
