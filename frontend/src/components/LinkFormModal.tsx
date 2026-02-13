import React, { FormEvent, useEffect, useState } from 'react';

interface LinkFormValues {
  url: string;
  tags: string[];
  notes?: string;
}

interface LinkFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialValues?: LinkFormValues;
  onClose: () => void;
  onSubmit: (values: LinkFormValues) => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

const LinkFormModal: React.FC<LinkFormModalProps> = ({
  isOpen,
  mode,
  initialValues,
  onClose,
  onSubmit,
  isSubmitting = false,
  errorMessage,
}) => {
  const [url, setUrl] = useState(initialValues?.url ?? '');
  const [tagsInput, setTagsInput] = useState(initialValues?.tags.join(', ') ?? '');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');

  useEffect(() => {
    if (isOpen) {
      setUrl(initialValues?.url ?? '');
      setTagsInput(initialValues?.tags.join(', ') ?? '');
      setNotes(initialValues?.notes ?? '');
    }
  }, [initialValues, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    onSubmit({ url, tags, notes: notes.trim() || undefined });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-form-title"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="link-form-title" className="text-lg font-semibold text-slate-900">
            {mode === 'create' ? 'Add a new link' : 'Edit link'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 hover:text-slate-700"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label htmlFor="link-url" className="mb-1 block text-sm font-medium text-slate-700">
              URL
            </label>
            <input
              id="link-url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
              disabled={mode === 'edit'}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <div>
            <label htmlFor="link-tags" className="mb-1 block text-sm font-medium text-slate-700">
              Tags
            </label>
            <input
              id="link-tags"
              type="text"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              placeholder="Comma separated"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
            <p className="mt-1 text-xs text-slate-500">Example: design, inspiration</p>
          </div>
          <div>
            <label htmlFor="link-notes" className="mb-1 block text-sm font-medium text-slate-700">
              Notes
            </label>
            <textarea
              id="link-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : mode === 'create' ? 'Add link' : 'Save changes'}
            </button>
          </div>
          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default LinkFormModal;
