import React from 'react';

import { Link } from '../api/types';
import LinkCard from './LinkCard';

interface LinkListProps {
  links: Link[];
  onEdit: (link: Link) => void;
}

const LinkList: React.FC<LinkListProps> = ({ links, onEdit }) => {
  if (links.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
        No links yet. Add one to get started!
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default LinkList;
