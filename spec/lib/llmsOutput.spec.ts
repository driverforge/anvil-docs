import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  finishLlmsFiles,
  finishLlmsOutput,
  finishMarkdown,
  llmsTxtPaths,
  rewriteAdmonitions,
} from '../../src/lib/llmsOutput';

describe('llmsOutput.ts', () => {
  describe('rewriteAdmonitions', () => {
    it('turns a titled admonition into a headed blockquote', () => {
      const md = [':::warning[Modifies your driver project]', 'It writes files.', '', 'Review them.', ':::'].join('\n');

      expect(rewriteAdmonitions(md)).toBe(
        ['> **Warning: Modifies your driver project**', '>', '> It writes files.', '>', '> Review them.'].join('\n'),
      );
    });

    it('heads an untitled admonition with its kind', () => {
      expect(rewriteAdmonitions(':::note\nBody.\n:::')).toBe('> **Note**\n>\n> Body.');
    });

    it('accepts the space-separated title form', () => {
      expect(rewriteAdmonitions(':::tip Pin it\nBody.\n:::')).toBe('> **Tip: Pin it**\n>\n> Body.');
    });

    it('quotes a code block inside an admonition without touching its contents', () => {
      const md = [':::info', '```bash', 'driverforge deploy', '```', ':::'].join('\n');

      expect(rewriteAdmonitions(md)).toBe(
        ['> **Info**', '>', '> ```bash', '> driverforge deploy', '> ```'].join('\n'),
      );
    });

    it('leaves ::: inside a code block alone', () => {
      const md = ['```md', ':::tip', 'Shown as written.', ':::', '```'].join('\n');

      expect(rewriteAdmonitions(md)).toBe(md);
    });

    it('leaves text with no admonitions unchanged', () => {
      const md = '# Title\n\nSome text.\n';
      expect(rewriteAdmonitions(md)).toBe(md);
    });
  });

  describe('finishMarkdown', () => {
    it('substitutes the CLI version token', () => {
      expect(finishMarkdown("version: '%%CLI_VERSION%%' # pinned", '1.2.3')).toBe(
        "version: '1.2.3' # pinned",
      );
    });

    it('strips the pathname:// prefix from links to static files', () => {
      expect(finishMarkdown('See [`llms.txt`](pathname:///llms.txt).', '1.2.3')).toBe(
        'See [`llms.txt`](/llms.txt).',
      );
    });
  });

  describe('llmsTxtPaths', () => {
    const llmsTxt = [
      '- [Overview](https://docs.driverforge.com/index.md): Start here.',
      '- [init](https://docs.driverforge.com/cli/init.md#options): Set up.',
      '- [Spec](https://llmstxt.org/): Elsewhere.',
    ].join('\n');

    it("returns this site's links as site-relative paths, without fragments", () => {
      expect(llmsTxtPaths(llmsTxt, 'https://docs.driverforge.com')).toEqual(['/index.md', '/cli/init.md']);
    });

    it('tolerates a trailing slash on the site URL', () => {
      expect(llmsTxtPaths(llmsTxt, 'https://docs.driverforge.com/')).toHaveLength(2);
    });
  });

  describe('finishLlmsOutput', () => {
    const siteUrl = 'https://docs.driverforge.com';
    let outDir: string;

    const write = async (file: string, content: string) => {
      await fs.mkdir(path.dirname(path.join(outDir, file)), { recursive: true });
      await fs.writeFile(path.join(outDir, file), content);
    };
    const read = (file: string) => fs.readFile(path.join(outDir, file), 'utf8');

    beforeEach(async () => {
      outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'llms-output-'));
      await write('index.html', '<article></article>');
      await write('index.md', '# Overview\n');
      await write('cicd/gitlab/index.html', '<div data-copy-page-menu=""></div>');
      await write('cicd/gitlab.md', ":::tip\nPin '%%CLI_VERSION%%'.\n:::");
      await write('llms-full.txt', "Pin '%%CLI_VERSION%%'.");
      await write(
        'llms.txt',
        `- [Overview](${siteUrl}/index.md)\n- [GitLab](${siteUrl}/cicd/gitlab.md)`,
      );
    });

    afterEach(async () => {
      await fs.rm(outDir, { recursive: true, force: true });
    });

    const finish = (docPermalinks = ['/', '/cicd/gitlab/']) =>
      finishLlmsOutput({ outDir, siteUrl, docPermalinks, cliVersion: '1.2.3' });

    it('finishes every page copy and llms-full.txt', async () => {
      await finish();

      expect(await read('cicd/gitlab.md')).toBe("> **Tip**\n>\n> Pin '1.2.3'.");
      expect(await read('llms-full.txt')).toBe("Pin '1.2.3'.");
    });

    it("doesn't expect the Copy menu on the home page", async () => {
      await expect(finish()).resolves.toBeUndefined();
    });

    it('finishes the files alone, reporting pages without a copy, for the dev server', async () => {
      const missing = await finishLlmsFiles({
        outDir,
        docPermalinks: ['/', '/cicd/gitlab/', '/cli/init/'],
        cliVersion: '1.2.3',
      });

      expect(missing).toEqual(['/cli/init/: no Markdown copy at /cli/init.md']);
      expect(await read('cicd/gitlab.md')).toBe("> **Tip**\n>\n> Pin '1.2.3'.");
    });

    it('fails when llms.txt links to a file the build did not produce', async () => {
      await write('llms.txt', `- [Overview](${siteUrl}/docs.md)`);

      await expect(finish()).rejects.toThrow('llms.txt links to /docs.md');
    });

    it('fails when a doc page has no Markdown copy', async () => {
      await write('cli/init/index.html', '<div data-copy-page-menu=""></div>');

      await expect(finish(['/', '/cicd/gitlab/', '/cli/init/'])).rejects.toThrow(
        '/cli/init/: no Markdown copy at /cli/init.md',
      );
    });

    it("fails when a doc page doesn't render the Copy menu", async () => {
      await write('cicd/gitlab/index.html', '<article></article>');

      await expect(finish()).rejects.toThrow("/cicd/gitlab/: the Copy menu isn't in the page");
    });
  });
});
