import { markdownPathFor, showsCopyPageMenu } from '../../src/lib/pageMarkdown';

describe('pageMarkdown.ts', () => {
  describe('markdownPathFor', () => {
    it('serves a page as a sibling .md of its route', () => {
      expect(markdownPathFor('/cli/init/')).toBe('/cli/init.md');
      expect(markdownPathFor('/coding-agents/skills/cli/')).toBe('/coding-agents/skills/cli.md');
    });

    it('accepts a route without a trailing slash', () => {
      expect(markdownPathFor('/cli/init')).toBe('/cli/init.md');
    });

    it('serves the site root as /index.md', () => {
      // The root page (slug: /) once came out as /docs, a 404.
      expect(markdownPathFor('/')).toBe('/index.md');
    });
  });

  describe('showsCopyPageMenu', () => {
    it('shows the menu on doc pages', () => {
      expect(showsCopyPageMenu('/cli/init/')).toBe(true);
    });

    it("leaves it off the docs' home page", () => {
      expect(showsCopyPageMenu('/')).toBe(false);
    });
  });
});
