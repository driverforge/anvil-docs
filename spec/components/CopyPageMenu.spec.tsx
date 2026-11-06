import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

jest.mock(
  '@docusaurus/plugin-content-docs/client',
  () => ({ useDoc: () => ({ metadata: { permalink: '/cli/init/' } }) }),
  { virtual: true },
);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyPageMenu = require('../../src/components/CopyPageMenu').default;

function hrefOf(name: string): string {
  return screen.getByRole('menuitem', { name }).getAttribute('href')!;
}

describe('CopyPageMenu', () => {
  let fetchMock: jest.Mock;
  let writeText: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'text/markdown; charset=utf-8' }),
      text: async () => '# init\n',
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const open = () => {
    render(<CopyPageMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy page' }));
  };

  it('carries the marker the build checks for', () => {
    const { container } = render(<CopyPageMenu />);

    expect(container.querySelector('[data-copy-page-menu]')).not.toBeNull();
  });

  it('keeps the menu closed until the button is clicked', () => {
    render(<CopyPageMenu />);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy page' })).toHaveAttribute('aria-expanded', 'false');
  });

  it("copies the page's generated Markdown, not the rendered page", async () => {
    open();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Copy page' }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith('# init\n'));
    expect(fetchMock).toHaveBeenCalledWith('/cli/init.md');
    expect(await screen.findByRole('menuitem', { name: 'Copied' })).toBeInTheDocument();
  });

  it('says so when the Markdown copy cannot be fetched', async () => {
    fetchMock.mockResolvedValue({ ok: false, text: async () => '' });
    open();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Copy page' }));

    expect(await screen.findByRole('menuitem', { name: "Couldn't copy the page" })).toBeInTheDocument();
    expect(writeText).not.toHaveBeenCalled();
  });

  it("won't copy an HTML page served in place of the Markdown", async () => {
    // A dev server, or a host's catch-all, answers a missing .md with its HTML
    // app shell and a 200.
    fetchMock.mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'text/html; charset=utf-8' }),
      text: async () => '<!DOCTYPE html><html></html>',
    });
    open();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Copy page' }));

    expect(await screen.findByRole('menuitem', { name: "Couldn't copy the page" })).toBeInTheDocument();
    expect(writeText).not.toHaveBeenCalled();
  });

  it('links View as Markdown to the same file', () => {
    open();

    expect(hrefOf('View as Markdown')).toBe('/cli/init.md');
  });

  it("points each assistant at the page's absolute Markdown URL", () => {
    open();
    const markdownUrl = `${window.location.origin}/cli/init.md`;

    for (const [name, base] of [
      ['Open in Claude', 'https://claude.ai/new'],
      ['Open in ChatGPT', 'https://chatgpt.com/'],
    ]) {
      const url = new URL(hrefOf(name));
      expect(`${url.origin}${url.pathname}`).toBe(base);
      expect(url.searchParams.get('q')).toContain(markdownUrl);
    }
  });

  it('describes each item beneath its title', () => {
    open();

    expect(screen.getByRole('menuitem', { name: 'Open in Claude' })).toHaveAccessibleDescription(
      'Ask questions about this page',
    );
  });

  it('offers only Claude and ChatGPT', () => {
    open();

    expect(screen.getAllByRole('menuitem', { name: /^Open in / })).toHaveLength(2);
    expect(screen.getByRole('menuitem', { name: 'Open in Claude' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Open in ChatGPT' })).toBeInTheDocument();
  });

  it('marks only links that leave the docs as external', () => {
    const { container } = render(<CopyPageMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy page' }));

    const items = [...container.querySelectorAll('[role="menuitem"]')];
    const external = items.filter((item) => item.querySelectorAll('svg').length > 1);
    expect(external.map((item) => item.getAttribute('href'))).toEqual(
      items.map((item) => item.getAttribute('href')).filter((href) => href?.startsWith('https://')),
    );
    expect(screen.getByRole('menuitem', { name: 'View as Markdown' })).toHaveAttribute('target', '_blank');
  });

  it('has no MCP install items', () => {
    open();

    expect(screen.queryByRole('menuitem', { name: /Cursor|VS Code/ })).not.toBeInTheDocument();
  });

  it('closes on Escape', () => {
    open();
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
