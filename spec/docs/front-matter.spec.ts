import fs from 'fs';
import path from 'path';

/**
 * Every page's front matter is valid YAML.
 *
 * An unquoted value containing `: ` (a description like "what it does: no
 * prompts") is read as a nested mapping. The dev server still renders the
 * page, but `docusaurus build` stops on it, so it only shows up in CI.
 */

const DOCS = path.join(__dirname, '..', '..', 'docs');

const markdownFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return /\.mdx?$/.test(entry.name) ? [full] : [];
  });

const FRONT_MATTER = /^---\n([\s\S]*?)\n---\n/;

describe('front matter', () => {
  it('parses as YAML on every page', () => {
    const offenders = markdownFiles(DOCS).flatMap((file) => {
      const match = fs.readFileSync(file, 'utf8').match(FRONT_MATTER);
      if (!match) return [];
      try {
        Bun.YAML.parse(match[1]);
        return [];
      } catch (err) {
        return [`${path.relative(DOCS, file)}  ${(err as Error).message}`];
      }
    });

    expect(offenders).toEqual([]);
  });
});
