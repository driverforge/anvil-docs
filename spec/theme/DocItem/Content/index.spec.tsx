import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock(
  '@theme-original/DocItem/Content',
  () => ({ default: () => <h1>init</h1> }),
  { virtual: true },
);
let mockPermalink = '/cli/init/';
jest.mock(
  '@docusaurus/plugin-content-docs/client',
  () => ({ useDoc: () => ({ metadata: { permalink: mockPermalink } }) }),
  { virtual: true },
);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ContentWrapper = require('../../../../src/theme/DocItem/Content').default;

describe('DocItem/Content', () => {
  beforeEach(() => {
    mockPermalink = '/cli/init/';
  });

  it('renders the Copy menu ahead of the doc body, so it sits beside the title', () => {
    render(<ContentWrapper>{null}</ContentWrapper>);

    const menu = screen.getByRole('button', { name: 'Copy page' });
    const title = screen.getByRole('heading', { name: 'init' });
    expect(menu.compareDocumentPosition(title) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("leaves the menu off the docs' home page", () => {
    mockPermalink = '/';
    render(<ContentWrapper>{null}</ContentWrapper>);

    expect(screen.queryByRole('button', { name: 'Copy page' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'init' })).toBeInTheDocument();
  });
});
