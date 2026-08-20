import fs from 'fs';
import path from 'path';

import { API_KEY_PLACEHOLDER_RE } from '../../src/lib/apiKey';

/**
 * The docs substitute a signed-in reader's own project token into code blocks,
 * but only where a placeholder is present — `hasApiKey` in TokenAwareCodeBlock
 * gates both the substitution and the project picker.
 *
 * That makes the feature fail silently: replace the placeholder with a literal
 * token and the page still looks correct, the picker just stops appearing and
 * every reader copies someone else's project token instead of their own. Two
 * earlier doc passes did exactly that, between them removing the last
 * placeholder on the site without anything objecting.
 */

const DOCS = path.join(__dirname, '..', '..', 'docs');

/** Pages whose snippets are meant to carry the reader's own token. */
const SUBSTITUTING_PAGES = [
  'getting-started/quick-start.md',
  'sdk/overview.md',
  'sdk/installation.md',
  'sdk/api-reference.md',
  'sdk/log-forwarding.md',
];

/**
 * The one page that documents the token itself, where a realistic literal is
 * the point — it shows the `drv_` shape and that committing one is safe.
 */
const TOKEN_EXPLAINER = 'platform/project-tokens.md';

const SAMPLE_TOKEN_RE = /drv_[A-Za-z0-9]{20,}/;

function read(rel: string): string {
  return fs.readFileSync(path.join(DOCS, rel), 'utf8');
}

function allMarkdown(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return allMarkdown(full);
    return entry.isFile() && entry.name.endsWith('.md') ? [full] : [];
  });
}

describe('api-key-placeholders', () => {
  it.each(SUBSTITUTING_PAGES)('%s still has a placeholder to substitute', (page) => {
    // A fresh regex per assertion: API_KEY_PLACEHOLDER_RE is global, so it
    // carries lastIndex between calls and would skip matches.
    expect(read(page)).toMatch(new RegExp(API_KEY_PLACEHOLDER_RE.source));
  });

  it.each(SUBSTITUTING_PAGES)('%s does not hardcode a sample token', (page) => {
    expect(read(page)).not.toMatch(SAMPLE_TOKEN_RE);
  });

  it('keeps the literal sample only on the page that documents the token', () => {
    const offenders = allMarkdown(DOCS)
      .filter((file) => SAMPLE_TOKEN_RE.test(fs.readFileSync(file, 'utf8')))
      .map((file) => path.relative(DOCS, file))
      .filter((rel) => rel !== TOKEN_EXPLAINER);

    expect(offenders).toEqual([]);
  });

  it('still documents the token shape on the explainer page', () => {
    // Guards the inverse: this page is where a literal belongs, so an
    // over-zealous sweep replacing every `drv_` would break what it teaches.
    expect(read(TOKEN_EXPLAINER)).toMatch(SAMPLE_TOKEN_RE);
  });
});
