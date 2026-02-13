import React from 'react';

import { Link } from '../api/types';

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onEdit }) => {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-brand-600 hover:underline"
          >
            {link.title || link.url}
          </a>
          {link.description && <p className="mt-1 text-sm text-slate-600">{link.description}</p>}
          {link.notes && <p className="mt-2 text-sm text-slate-700">Notes: {link.notes}</p>}
          {link.tags.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tags">
              {link.tags.map((tag) => (
                <li
                  key={`${link.id}-${tag}`}
                  className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                >
                  #{tag}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={() => onEdit(link)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
        >
          Edit
        </button>
      </div>
      {link.imageUrl && (
        <img
          src={link.imageUrl}
          alt="Preview"
          className="mt-4 max-h-40 w-full rounded-md object-cover"
          loading="lazy"
        />
      )}
    </article>
  );
};

export default LinkCard;
