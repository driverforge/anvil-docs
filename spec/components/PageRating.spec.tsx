import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PageRating from '../../src/components/PageRating';

const mockPathname = '/sdk/installation';
const mockEditUrl = 'https://github.com/driverforge/anvil-docs/edit/main/docs/sdk/installation.md';

// Both are Docusaurus build-time aliases, not resolvable packages, so the mocks
// must be declared virtual for jest to hoist them.
jest.mock('@docusaurus/router', () => ({ useLocation: () => ({ pathname: mockPathname }) }), {
  virtual: true,
});
jest.mock(
  '@docusaurus/plugin-content-docs/client',
  () => ({ useDoc: () => ({ metadata: { editUrl: mockEditUrl } }) }),
  { virtual: true },
);

const FEEDBACK_URL = `${process.env.APP_URL || 'https://app.driverforge.dev'}/api/docs/feedback`;

function bodyOf(call: unknown[]): Record<string, unknown> {
  return JSON.parse((call[1] as RequestInit).body as string);
}

function hrefOf(text: string): string | null {
  return screen.getByText(text).closest('a')!.getAttribute('href');
}

describe('PageRating', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn((_url: string, opts: RequestInit) => {
      if (opts.method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: async () => ({ id: 'fb-1' }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ ok: true }),
      } as Response);
    });
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the rating prompt, buttons, and footer links', () => {
    render(<PageRating />);

    expect(screen.getByText('How helpful was this page?')).toBeInTheDocument();
    expect(screen.getByLabelText('Not helpful at all')).toBeInTheDocument();
    expect(screen.getByLabelText('Very helpful')).toBeInTheDocument();

    // Page-specific action links (global CTAs live in the site footer).
    expect(hrefOf('Open an issue')).toBe(
      'https://github.com/driverforge/anvil-docs/issues/new/choose',
    );
    expect(hrefOf('Edit this page')).toBe(mockEditUrl);
    expect(screen.queryByText('Need more help?')).not.toBeInTheDocument();
  });

  it('POSTs the rating and reveals the comment form on click (buttons stay)', async () => {
    render(<PageRating />);

    fireEvent.click(screen.getByLabelText('Very helpful'));

    // Comment form appears; the emoji buttons remain (now marked pressed).
    expect(
      await screen.findByLabelText('How can we improve this page for you?'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Very helpful')).toHaveAttribute('aria-pressed', 'true');

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, opts] = fetchMock.mock.calls[0];
    expect(url).toBe(FEEDBACK_URL);
    expect((opts as RequestInit).method).toBe('POST');
    expect(bodyOf(fetchMock.mock.calls[0])).toEqual({
      path: mockPathname,
      rating: 2,
    });
  });

  it('PATCHes the comment (with the row id) and shows a thank-you on submit', async () => {
    render(<PageRating />);

    fireEvent.click(screen.getByLabelText('Not very helpful'));
    fireEvent.change(await screen.findByLabelText('How can we improve this page for you?'), {
      target: { value: '  the install step is out of date  ' },
    });
    fireEvent.click(screen.getByText('Submit feedback'));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const patch = fetchMock.mock.calls[1];
    expect((patch[1] as RequestInit).method).toBe('PATCH');
    expect(bodyOf(patch)).toEqual({
      id: 'fb-1',
      comment: 'the install step is out of date',
    });
    expect(await screen.findByText('Thanks for helping us improve the docs.')).toBeInTheDocument();
  });

  it('does not PATCH when the comment is blank', async () => {
    render(<PageRating />);

    fireEvent.click(screen.getByLabelText('Helpful'));
    fireEvent.click(await screen.findByText('Submit feedback'));

    await screen.findByText('Thanks for helping us improve the docs.');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect((fetchMock.mock.calls[0][1] as RequestInit).method).toBe('POST');
  });

  it('degrades gracefully when the rating request fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response);
    render(<PageRating />);

    fireEvent.click(screen.getByLabelText('Helpful'));
    fireEvent.change(await screen.findByLabelText('How can we improve this page for you?'), {
      target: { value: 'still broken' },
    });
    fireEvent.click(screen.getByText('Submit feedback'));

    await screen.findByText('Thanks for helping us improve the docs.');
    // Only the (failed) POST — no PATCH attempted without an id.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
