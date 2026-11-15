import type { PrismTheme } from 'prism-react-renderer';

/**
 * GitHub Light and GitHub Dark for Prism, so code here reads like the code on
 * the blog, which highlights with Shiki's github-light / github-dark.
 * prism-react-renderer has no GitHub Dark, and its `github` theme is GitHub's
 * older palette, so these carry the Shiki themes' colours.
 */
interface GithubPalette {
  background: string;
  plain: string;
  comment: string;
  keyword: string;
  string: string;
  constant: string;
  func: string;
  tag: string;
  variable: string;
  deleted: string;
  inserted: string;
}

export const GITHUB_LIGHT: GithubPalette = {
  background: '#fff',
  plain: '#24292e',
  comment: '#6a737d',
  keyword: '#d73a49',
  string: '#032f62',
  constant: '#005cc5',
  func: '#6f42c1',
  tag: '#22863a',
  variable: '#e36209',
  deleted: '#b31d28',
  inserted: '#22863a',
};

export const GITHUB_DARK: GithubPalette = {
  background: '#24292e',
  plain: '#e1e4e8',
  comment: '#6a737d',
  keyword: '#f97583',
  string: '#9ecbff',
  constant: '#79b8ff',
  func: '#b392f0',
  tag: '#85e89d',
  variable: '#ffab70',
  deleted: '#fdaeb7',
  inserted: '#85e89d',
};

function prismTheme(p: GithubPalette): PrismTheme {
  return {
    plain: { color: p.plain, backgroundColor: p.background },
    styles: [
      { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: p.comment } },
      {
        types: ['keyword', 'operator', 'important', 'atrule', 'rule'],
        style: { color: p.keyword },
      },
      { types: ['string', 'char', 'attr-value', 'regex', 'url'], style: { color: p.string } },
      {
        types: ['number', 'boolean', 'constant', 'builtin', 'property', 'symbol', 'selector'],
        style: { color: p.constant },
      },
      { types: ['function', 'class-name', 'attr-name'], style: { color: p.func } },
      { types: ['tag'], style: { color: p.tag } },
      { types: ['variable', 'parameter'], style: { color: p.variable } },
      { types: ['punctuation'], style: { color: p.plain } },
      { types: ['deleted'], style: { color: p.deleted } },
      { types: ['inserted'], style: { color: p.inserted } },
    ],
  };
}

export const githubLight = prismTheme(GITHUB_LIGHT);
export const githubDark = prismTheme(GITHUB_DARK);
