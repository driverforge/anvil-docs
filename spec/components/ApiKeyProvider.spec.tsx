import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import {
  ApiKeyProvider,
  useApiKey,
} from '../../src/components/ApiKeyProvider';
import { SELECTED_PROJECT_STORAGE_KEY } from '../../src/lib/apiKey';

function Probe() {
  const { state, previewMode, selectProject } = useApiKey();
  return (
    <div>
      <div data-testid="status">{state.status}</div>
      <div data-testid="preview">{String(previewMode)}</div>
      {state.status === 'ready' && (
        <>
          <div data-testid="selected">{state.selectedProjectId}</div>
          <div data-testid="project-count">{state.projects.length}</div>
          <button
            type="button"
            data-testid="select-p2"
            onClick={() => selectProject('p-2')}
          >
            switch
          </button>
        </>
      )}
    </div>
  );
}

describe('ApiKeyProvider', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  function mockFetchOnce(init: {
    status?: number;
    ok?: boolean;
    json?: unknown;
    reject?: Error;
  }) {
    global.fetch = jest.fn(() =>
      init.reject
        ? Promise.reject(init.reject)
        : Promise.resolve({
            ok: init.ok ?? true,
            status: init.status ?? 200,
            json: async () => init.json,
          } as Response),
    ) as unknown as typeof fetch;
  }

  it('transitions loading → anonymous on 401', async () => {
    mockFetchOnce({ ok: false, status: 401, json: {} });

    render(
      <ApiKeyProvider>
        <Probe />
      </ApiKeyProvider>,
    );

    expect(screen.getByTestId('status').textContent).toBe('loading');
    await waitFor(() =>
      expect(screen.getByTestId('status').textContent).toBe('anonymous'),
    );
  });

  it('exposes previewMode from the anonymous (401) response', async () => {
    mockFetchOnce({ ok: false, status: 401, json: { previewMode: true } });

    render(
      <ApiKeyProvider>
        <Probe />
      </ApiKeyProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('status').textContent).toBe('anonymous'),
    );
    expect(screen.getByTestId('preview').textContent).toBe('true');
  });

  it('exposes previewMode from the authenticated response', async () => {
    mockFetchOnce({
      ok: true,
      status: 200,
      json: {
        previewMode: true,
        projects: [
          { id: 'p-1', name: 'One', slug: 'one', orgName: 'Acme', apiKey: 'k-one' },
        ],
      },
    });

    render(
      <ApiKeyProvider>
        <Probe />
      </ApiKeyProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('status').textContent).toBe('ready'),
    );
    expect(screen.getByTestId('preview').textContent).toBe('true');
  });

  it('defaults previewMode to false when the proxy omits it', async () => {
    mockFetchOnce({ ok: false, status: 401, json: {} });

    render(
      <ApiKeyProvider>
        <Probe />
      </ApiKeyProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('status').textContent).toBe('anonymous'),
    );
    expect(screen.getByTestId('preview').textContent).toBe('false');
  });

  it('transitions loading → ready and selects the first project by default', async () => {
    mockFetchOnce({
      ok: true,
      status: 200,
      json: {
        projects: [
          { id: 'p-1', name: 'One', slug: 'one', orgName: 'Acme', apiKey: 'k-one' },
          { id: 'p-2', name: 'Two', slug: 'two', orgName: 'Acme', apiKey: 'k-two' },
        ],
      },
    });

    render(
      <ApiKeyProvider>
        <Probe />
      </ApiKeyProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('status').textContent).toBe('ready'),
    );
    expect(screen.getByTestId('selected').textContent).toBe('p-1');
    expect(screen.getByTestId('project-count').textContent).toBe('2');
  });

  it('honours the stored selection when it still exists', async () => {
    window.localStorage.setItem(SELECTED_PROJECT_STORAGE_KEY, 'p-2');
    mockFetchOnce({
      ok: true,
      status: 200,
      json: {
        projects: [
          { id: 'p-1', name: 'One', slug: 'one', orgName: 'Acme', apiKey: 'k-one' },
          { id: 'p-2', name: 'Two', slug: 'two', orgName: 'Acme', apiKey: 'k-two' },
        ],
      },
    });

    render(
      <ApiKeyProvider>
        <Probe />
      </ApiKeyProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('selected').textContent).toBe('p-2'),
    );
  });

  it('persists selection changes to localStorage', async () => {
    mockFetchOnce({
      ok: true,
      status: 200,
      json: {
        projects: [
          { id: 'p-1', name: 'One', slug: 'one', orgName: 'Acme', apiKey: 'k-one' },
          { id: 'p-2', name: 'Two', slug: 'two', orgName: 'Acme', apiKey: 'k-two' },
        ],
      },
    });

    render(
      <ApiKeyProvider>
        <Probe />
      </ApiKeyProvider>,
    );

    const btn = await screen.findByTestId('select-p2');

    act(() => {
      btn.click();
    });

    expect(screen.getByTestId('selected').textContent).toBe('p-2');
    expect(
      window.localStorage.getItem(SELECTED_PROJECT_STORAGE_KEY),
    ).toBe('p-2');
  });

  it('transitions to error on network failure', async () => {
    mockFetchOnce({ reject: new Error('boom') });

    render(
      <ApiKeyProvider>
        <Probe />
      </ApiKeyProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('status').textContent).toBe('error'),
    );
  });

  it('treats a signed-in empty project list as no-projects (onboarding), not error', async () => {
    mockFetchOnce({
      ok: true,
      status: 200,
      json: { projects: [] },
    });

    render(
      <ApiKeyProvider>
        <Probe />
      </ApiKeyProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId('status').textContent).toBe('no-projects'),
    );
  });

  it('calls the proxy with credentials included', async () => {
    const fetchSpy = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ projects: [] }),
      } as Response),
    );
    global.fetch = fetchSpy as unknown as typeof fetch;

    render(
      <ApiKeyProvider>
        <Probe />
      </ApiKeyProvider>,
    );

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenCalledWith(
        'https://app.driverforge.test/api/docs/projects',
        { credentials: 'include' },
      ),
    );
  });
});
