// src/tests/components/Footer.test.tsx

import { render, screen } from '@testing-library/preact';
import { describe, it, expect } from 'vitest';
import { Footer } from '../../components/Footer';

describe('Footer Component', () => {
  it('should render the copyright text', () => {
    render(<Footer />);
    expect(screen.getByText('© 2024 Imperfect Gamers. All rights reserved.')).toBeInTheDocument();
  });

  it('should render all footer links', () => {
    render(<Footer />);
    const links = [
      { href: '#', label: 'Home' },
      { href: '#', label: 'Store' },
      { href: '#', label: 'Stats' },
    ];
    links.forEach(link => {
      expect(screen.getByText(link.label)).toBeInTheDocument();
    });
  });
});
