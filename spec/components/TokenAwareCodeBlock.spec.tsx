import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { TokenAwareCodeBlock } from '../../src/components/TokenAwareCodeBlock';
import { ApiKeyProvider } from '../../src/components/ApiKeyProvider';

// A minimal stand-in for the original @theme/MDXComponents/Code that just
// renders its children so we can assert on the substituted text.
function FakeOriginalCode({ children }: { children?: React.ReactNode }) {
  return <pre data-testid="code">{children}</pre>;
}

function mockProjectsResponse() {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({
        projects: [
          { id: 'p-1', name: 'One', slug: 'one', orgName: 'Acme', apiKey: 'real-key-one' },
          { id: 'p-2', name: 'Two', slug: 'two', orgName: 'Acme', apiKey: 'real-key-two' },
        ],
      }),
    } as Response),
  ) as unknown as typeof fetch;
}

describe('TokenAwareCodeBlock', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    window.localStorage.clear();
  });

  it('renders the placeholder literally when the provider is anonymous', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: async () => ({}),
      } as Response),
    ) as unknown as typeof fetch;

    render(
      <ApiKeyProvider>
        <TokenAwareCodeBlock OriginalCode={FakeOriginalCode}>
          {'Anvil:Init("YOUR_API_KEY")'}
        </TokenAwareCodeBlock>
      </ApiKeyProvider>,
    );

    // The code continues to show the placeholder literally, and once the
    // 401 resolves the button transitions to the sign-in affordance.
    expect(screen.getByTestId('code').textContent).toBe(
      'Anvil:Init("YOUR_API_KEY")',
    );
    const link = await screen.findByText(/Sign in for your API key/i);
    expect(link).toBeInTheDocument();
    // Should be a direct link (same tab), not a button that opens a picker
    expect(link.tagName).toBe('A');
    expect(link).not.toHaveAttribute('target');
    expect(link).toHaveAttribute(
      'href',
      expect.stringContaining('/auth/login'),
    );
    expect(screen.getByTestId('code').textContent).toBe(
      'Anvil:Init("YOUR_API_KEY")',
    );
  });

  it('shows a friendly "create a project" link when signed in with no projects', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ projects: [] }),
      } as Response),
    ) as unknown as typeof fetch;

    render(
      <ApiKeyProvider>
        <TokenAwareCodeBlock OriginalCode={FakeOriginalCode}>
          {'Anvil:Init("YOUR_API_KEY")'}
        </TokenAwareCodeBlock>
      </ApiKeyProvider>,
    );

    const link = await screen.findByText(/Create a project for your API key/i);
    expect(link.tagName).toBe('A');
    // Not the scary error copy, and not the sign-in flow (they're signed in).
    expect(screen.queryByText(/Unable to load/i)).not.toBeInTheDocument();
    expect(link).not.toHaveAttribute(
      'href',
      expect.stringContaining('/auth/login'),
    );
    // Placeholder stays literal.
    expect(screen.getByTestId('code').textContent).toBe(
      'Anvil:Init("YOUR_API_KEY")',
    );
  });

  it('substitutes the real key once projects load', async () => {
    mockProjectsResponse();

    render(
      <ApiKeyProvider>
        <TokenAwareCodeBlock OriginalCode={FakeOriginalCode}>
          {'Anvil:Init("YOUR_API_KEY")'}
        </TokenAwareCodeBlock>
      </ApiKeyProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('code').textContent).toBe(
        'Anvil:Init("real-key-one")',
      ),
    );
    // Button shows org/project with a tooltip
    const btn = screen.getByText('Acme / One');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute(
      'title',
      'Showing API key for Acme / One — click to switch',
    );
  });

  it('substitutes the lowercase-hyphenated variant too', async () => {
    mockProjectsResponse();

    render(
      <ApiKeyProvider>
        <TokenAwareCodeBlock OriginalCode={FakeOriginalCode}>
          {'driverforge init my-driver --apikey "your-api-key"'}
        </TokenAwareCodeBlock>
      </ApiKeyProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('code').textContent).toBe(
        'driverforge init my-driver --apikey "real-key-one"',
      ),
    );
  });

  it('renders a copy button for fenced blocks and copies the substituted code', async () => {
    mockProjectsResponse();
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(global.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(
      <ApiKeyProvider>
        <TokenAwareCodeBlock
          OriginalCode={FakeOriginalCode}
          className="language-lua"
        >
          {'Anvil:Init("YOUR_API_KEY")\n'}
        </TokenAwareCodeBlock>
      </ApiKeyProvider>,
    );

    // Wait for the ready state (real key substituted), then copy.
    await screen.findByText('Acme / One');
    fireEvent.click(
      screen.getByRole('button', { name: /copy code to clipboard/i }),
    );
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('Anvil:Init("real-key-one")'),
    );
  });

  it('renders a copy button but no project selector for a plain fenced block', async () => {
    mockProjectsResponse();
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(global.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(
      <ApiKeyProvider>
        <TokenAwareCodeBlock
          OriginalCode={FakeOriginalCode}
          className="language-bash"
        >
          {'ls -la\n'}
        </TokenAwareCodeBlock>
      </ApiKeyProvider>,
    );

    fireEvent.click(
      await screen.findByRole('button', { name: /copy code to clipboard/i }),
    );
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('ls -la'));
    // No project selector on a snippet that doesn't reference the API key.
    expect(screen.queryByText('Acme / One')).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Sign in for your API key/i),
    ).not.toBeInTheDocument();
  });

  it('does not render a copy button for inline code (no language class)', async () => {
    mockProjectsResponse();

    render(
      <ApiKeyProvider>
        <TokenAwareCodeBlock OriginalCode={FakeOriginalCode}>
          {'Anvil:Init("YOUR_API_KEY")'}
        </TokenAwareCodeBlock>
      </ApiKeyProvider>,
    );

    await screen.findByText('Acme / One');
    expect(
      screen.queryByRole('button', { name: /copy code to clipboard/i }),
    ).not.toBeInTheDocument();
  });
});
