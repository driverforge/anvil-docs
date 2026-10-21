import fs from 'fs';
import path from 'path';

/**
 * Admonition titles go in brackets: `:::warning[Experimental]`.
 *
 * The site opts into Docusaurus' v4 future flags, which turn off the MDX 1
 * syntax that put the title after a space (`:::warning Experimental`). That
 * form doesn't fail the build; the whole box renders as one paragraph of
 * literal text, colons included, so it is easy to ship without noticing.
 */

const DOCS = path.join(__dirname, '..', '..', 'docs');

const markdownFiles = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return /\.mdx?$/.test(entry.name) ? [full] : [];
  });

const SPACE_TITLED = /^\s*:::[a-z]+ +\S/;

describe('admonitions', () => {
  it('give every title in brackets', () => {
    const offenders = markdownFiles(DOCS).flatMap((file) =>
      fs
        .readFileSync(file, 'utf8')
        .split('\n')
        .map((line, i) => ({ line, at: `${path.relative(DOCS, file)}:${i + 1}` }))
        .filter(({ line }) => SPACE_TITLED.test(line))
        .map(({ at, line }) => `${at}  ${line.trim()}`),
    );

    expect(offenders).toEqual([]);
  });
});
