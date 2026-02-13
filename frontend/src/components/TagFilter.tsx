import React from 'react';

interface TagFilterProps {
  tags: string[];
  value: string;
  onChange: (value: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, value, onChange }) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="tag-filter" className="text-sm font-medium text-slate-700">
        Filter by tag
      </label>
      <select
        id="tag-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      >
        <option value="">All tags</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TagFilter;
