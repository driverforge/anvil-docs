import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PageRating from '../../src/components/PageRating';

const mockPathname = '/sdk/installation';
// `@docusaurus/router` is a Docusaurus build-time alias, not a resolvable
// package, so the mock must be declared virtual for jest to hoist it.
jest.mock('@docusaurus/router', () => ({ useLocation: () => ({ pathname: mockPathname }) }), {
  virtual: true,
});

// The component inlines APP_URL from process.env at import time; jest.setup sets
// it to app.driverforge.test.
const FEEDBACK_URL = `${process.env.APP_URL || 'https://app.driverforge.dev'}/api/docs/feedback`;

function bodyOf(call: unknown[]): Record<string, unknown> {
  return JSON.parse((call[1] as RequestInit).body as string);
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

  it('renders the prompt and four rating buttons', () => {
    render(<PageRating />);

    expect(screen.getByText('Was this page helpful?')).toBeInTheDocument();
    expect(screen.getByLabelText('Not helpful at all')).toBeInTheDocument();
    expect(screen.getByLabelText('Not very helpful')).toBeInTheDocument();
    expect(screen.getByLabelText('Helpful')).toBeInTheDocument();
    expect(screen.getByLabelText('Very helpful')).toBeInTheDocument();
  });

  it('POSTs the rating and reveals the comment form on click', async () => {
    render(<PageRating />);

    fireEvent.click(screen.getByLabelText('Very helpful'));

    // Comment form appears.
    expect(await screen.findByLabelText('How can we improve this page?')).toBeInTheDocument();
    expect(screen.queryByLabelText('Very helpful')).not.toBeInTheDocument();

    // Rating POSTed with path + rating.
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
    fireEvent.change(await screen.findByLabelText('How can we improve this page?'), {
      target: { value: '  the install step is out of date  ' },
    });
    fireEvent.click(screen.getByText('Submit feedback'));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const patch = fetchMock.mock.calls[1];
    expect((patch[1] as RequestInit).method).toBe('PATCH');
    expect(bodyOf(patch)).toEqual({
      id: 'fb-1',
      comment: 'the install step is out of date', // trimmed
    });
    expect(await screen.findByText('Thanks for helping us improve the docs.')).toBeInTheDocument();
  });

  it('does not PATCH when the comment is blank', async () => {
    render(<PageRating />);

    fireEvent.click(screen.getByLabelText('Helpful'));
    fireEvent.click(await screen.findByText('Submit feedback'));

    // Only the rating POST — no comment PATCH.
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

    // Form still shows; submitting with a comment does not PATCH (no row id) and
    // does not throw.
    fireEvent.change(await screen.findByLabelText('How can we improve this page?'), {
      target: { value: 'still broken' },
    });
    fireEvent.click(screen.getByText('Submit feedback'));

    await screen.findByText('Thanks for helping us improve the docs.');
    // Only the (failed) POST — no PATCH attempted without an id.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
