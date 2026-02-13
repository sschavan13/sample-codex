import React from 'react';
import { render, screen } from '@testing-library/react';

import { Link } from '../../api/types';
import LinkList from '../LinkList';

describe('LinkList', () => {
  const links: Link[] = [
    {
      id: 1,
      url: 'https://example.com',
      title: 'Example',
      description: 'An example site',
      imageUrl: null,
      notes: 'Check this later',
      tags: ['example', 'docs'],
    },
  ];

  it('renders a list of links', () => {
    render(<LinkList links={links} onEdit={() => undefined} />);

    expect(screen.getByText('Example')).toBeInTheDocument();
    expect(screen.getByText('#example')).toBeInTheDocument();
    expect(screen.getByText(/Check this later/i)).toBeInTheDocument();
  });
});
