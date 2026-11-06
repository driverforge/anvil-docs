import path from 'node:path';
import type { LoadContext, Plugin, PluginModule } from '@docusaurus/types';
import docusaurusPluginLLMs, { type PluginOptions } from 'docusaurus-plugin-llms';
import { cliVersion } from '../lib/cliVersion';
import { finishLlmsFiles, finishLlmsOutput } from '../lib/llmsOutput';

type DocsContent = { loadedVersions: { docs: { permalink: string }[] }[] };

const DOCS_PLUGIN = 'docusaurus-plugin-content-docs';

function permalinksOf(docs: unknown): string[] {
  return (docs as DocsContent).loadedVersions.flatMap((version) =>
    version.docs.map((doc) => doc.permalink),
  );
}

// docusaurus-plugin-llms, finished by finishLlmsOutput once it has written its
// files. Docusaurus runs plugins' postBuild hooks in parallel, so the finishing
// step has to live in the same hook to be sure the files exist.
//
// `docusaurus start` has no postBuild, so in dev the same files are written to
// .docusaurus/llms each time content loads (on start, and again when a doc
// changes) and the dev server serves them alongside static/.
function llmsPlugin(context: LoadContext, options: unknown): Plugin<void> {
  const plugin = docusaurusPluginLLMs(context, options as PluginOptions);
  const isDev = process.env.NODE_ENV !== 'production';
  const devOutDir = path.join(context.generatedFilesDir, 'llms');

  return {
    ...plugin,

    async allContentLoaded({ allContent }) {
      if (!isDev) return;
      // The llms plugin writes to the outDir it was created with.
      const devPlugin = docusaurusPluginLLMs({ ...context, outDir: devOutDir }, options as PluginOptions);
      // Without routes from a build it derives URLs from the doc files.
      await devPlugin.postBuild?.({} as Parameters<NonNullable<typeof devPlugin.postBuild>>[0]);

      const missing = await finishLlmsFiles({
        outDir: devOutDir,
        docPermalinks: permalinksOf(allContent[DOCS_PLUGIN]?.default),
        cliVersion: await cliVersion(),
      });
      if (missing.length > 0) console.warn(`[anvil-docs] ${missing.join('\n  ')}`);
    },

    configureWebpack() {
      if (!isDev) return {};
      // webpack-dev-server options; Docusaurus merges a returned devServer into its own.
      return { devServer: { static: [{ directory: devOutDir, publicPath: '/' }] } } as object;
    },

    async postBuild(props) {
      await plugin.postBuild?.(props);

      await finishLlmsOutput({
        outDir: props.outDir,
        siteUrl: props.siteConfig.url,
        docPermalinks: permalinksOf(props.plugins.find((p) => p.name === DOCS_PLUGIN)?.content),
        cliVersion: await cliVersion(),
      });
    },
  };
}

// Docusaurus passes options as unknown (docusaurus-plugin-llms validates them),
// and types a plugin module's content as unknown where this one has none.
export default llmsPlugin as PluginModule;
