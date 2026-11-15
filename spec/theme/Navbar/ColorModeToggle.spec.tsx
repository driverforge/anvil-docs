import React from 'react';
import { render } from '@testing-library/react';

import NavbarColorModeToggle from '../../../src/theme/Navbar/ColorModeToggle';

describe('Navbar/ColorModeToggle', () => {
  it('renders nothing, leaving the Theme selector as the only control', () => {
    const { container } = render(<NavbarColorModeToggle />);

    expect(container.innerHTML).toBe('');
  });
});
