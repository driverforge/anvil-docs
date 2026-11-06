import { promises as fs } from 'node:fs';
import path from 'node:path';
import { CLI_VERSION_TOKEN } from './cliVersion';
import { COPY_PAGE_MENU_MARKER, markdownPathFor, showsCopyPageMenu } from './pageMarkdown';

// docusaurus-plugin-llms copies the doc sources as written, so the site-only
// syntax in them reaches agents verbatim. This finishes its output the way the
// rendered site finishes the same sources, then checks every link it promises.

const FENCE = /^\s*(`{3,}|~{3,})/;
const ADMONITION_OPEN = /^:::([a-z]+)(?:\[(.*)\]|[ \t]+(.+?))?[ \t]*$/;

// :::tip[Title] ... ::: becomes a blockquote headed "Tip: Title". Fences are
// tracked so a ::: inside a code block is left alone.
export function rewriteAdmonitions(markdown: string): string {
  const out: string[] = [];
  let fence: string | null = null;
  let inAdmonition = false;

  for (const line of markdown.split('\n')) {
    const marker = FENCE.exec(line)?.[1];
    if (fence !== null) {
      if (marker?.startsWith(fence)) fence = null;
    } else if (marker) {
      fence = marker;
    } else if (!inAdmonition) {
      const open = ADMONITION_OPEN.exec(line);
      if (open) {
        const kind = open[1][0].toUpperCase() + open[1].slice(1);
        const title = open[2] ?? open[3];
        out.push(`> **${title ? `${kind}: ${title}` : kind}**`, '>');
        inAdmonition = true;
        continue;
      }
    } else if (line.trim() === ':::') {
      inAdmonition = false;
      continue;
    }
    out.push(inAdmonition ? (line ? `> ${line}` : '>') : line);
  }

  return out.join('\n');
}

// pathname:// marks a link to a static file rather than a page; the site
// strips it when rendering, so the Markdown should too.
export function finishMarkdown(markdown: string, cliVersion: string): string {
  return rewriteAdmonitions(
    markdown.split(CLI_VERSION_TOKEN).join(cliVersion).split('](pathname://').join(']('),
  );
}

// The site-relative paths of the links in llms.txt that point at this site.
export function llmsTxtPaths(llmsTxt: string, siteUrl: string): string[] {
  const base = siteUrl.replace(/\/+$/, '');
  return [...llmsTxt.matchAll(/\]\(([^)\s]+)\)/g)]
    .map((m) => m[1])
    .filter((url) => url.startsWith(`${base}/`))
    .map((url) => decodeURI(url.slice(base.length).split('#')[0]));
}

async function exists(file: string): Promise<boolean> {
  return fs.access(file).then(
    () => true,
    () => false,
  );
}

async function rewrite(file: string, cliVersion: string): Promise<void> {
  const markdown = await fs.readFile(file, 'utf8');
  await fs.writeFile(file, finishMarkdown(markdown, cliVersion));
}

type FinishFilesOptions = {
  outDir: string;
  docPermalinks: string[];
  cliVersion: string;
};

// Finishes each page's Markdown copy and llms-full.txt in place. Returns the
// pages that have no copy.
export async function finishLlmsFiles({
  outDir,
  docPermalinks,
  cliVersion,
}: FinishFilesOptions): Promise<string[]> {
  const problems: string[] = [];

  for (const permalink of docPermalinks) {
    const markdownFile = path.join(outDir, markdownPathFor(permalink));
    if (await exists(markdownFile)) await rewrite(markdownFile, cliVersion);
    else problems.push(`${permalink}: no Markdown copy at ${markdownPathFor(permalink)}`);
  }

  const llmsFull = path.join(outDir, 'llms-full.txt');
  if (await exists(llmsFull)) await rewrite(llmsFull, cliVersion);

  return problems;
}

type FinishOptions = FinishFilesOptions & { siteUrl: string };

// Throws, failing the build, when a doc page has no Markdown copy or is missing
// the Copy menu it should have, or when llms.txt links to a file the build didn't produce.
export async function finishLlmsOutput({
  outDir,
  siteUrl,
  docPermalinks,
  cliVersion,
}: FinishOptions): Promise<void> {
  const problems = await finishLlmsFiles({ outDir, docPermalinks, cliVersion });

  for (const permalink of docPermalinks.filter(showsCopyPageMenu)) {
    const html = await fs
      .readFile(path.join(outDir, permalink, 'index.html'), 'utf8')
      .catch(() => '');
    if (!html.includes(COPY_PAGE_MENU_MARKER)) {
      problems.push(`${permalink}: the Copy menu isn't in the page`);
    }
  }

  const llmsTxt = await fs.readFile(path.join(outDir, 'llms.txt'), 'utf8');
  for (const linked of llmsTxtPaths(llmsTxt, siteUrl)) {
    if (!(await exists(path.join(outDir, linked)))) {
      problems.push(`llms.txt links to ${linked}, which the build didn't produce`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`Generated Markdown for agents is incomplete:\n  ${problems.join('\n  ')}`);
  }
}
