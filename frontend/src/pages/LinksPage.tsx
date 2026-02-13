import React, { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createLink, updateLink } from '../api/links';
import { linkKeys } from '../api/queryKeys';
import { Link } from '../api/types';
import LinkFormModal from '../components/LinkFormModal';
import LinkList from '../components/LinkList';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import TagFilter from '../components/TagFilter';
import { useLinks } from '../hooks/useLinks';

const PAGE_SIZE = 10;

const getErrorMessage = (error: unknown): string | undefined => {
  if (!error) {
    return undefined;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Something went wrong';
};

const LinksPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ search: '', tag: '', page: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const queryClient = useQueryClient();

  const queryParams = useMemo(
    () => ({
      search: filters.search || undefined,
      tag: filters.tag || undefined,
      page: filters.page,
      size: PAGE_SIZE,
    }),
    [filters]
  );

  const { data, isLoading, isError, error, isFetching } = useLinks(queryParams);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    data?.items.forEach((link) => {
      link.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [data]);

  const createMutation = useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      queryClient.invalidateQueries(linkKeys.all);
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { notes?: string; tags?: string[] } }) =>
      updateLink(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(linkKeys.all);
      setIsModalOpen(false);
      setSelectedLink(null);
    },
  });

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedLink(null);
    setIsModalOpen(true);
  };

  const openEditModal = (link: Link) => {
    setModalMode('edit');
    setSelectedLink(link);
    setIsModalOpen(true);
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleTagChange = (tag: string) => {
    setFilters((prev) => ({ ...prev, tag, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleCreateSubmit = ({ url, tags, notes }: { url: string; tags: string[]; notes?: string }) => {
    createMutation.mutate({ url, tags, notes });
  };

  const handleUpdateSubmit = ({ tags, notes }: { url: string; tags: string[]; notes?: string }) => {
    if (!selectedLink) {
      return;
    }
    updateMutation.mutate({ id: selectedLink.id, payload: { tags, notes } });
  };

  const total = data?.total ?? 0;
  const currentPage = data?.page ?? filters.page;
  const links = data?.items ?? [];

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <SearchBar value={searchTerm} onChange={setSearchTerm} onSubmit={handleSearch} />
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <TagFilter tags={availableTags} value={filters.tag} onChange={handleTagChange} />
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
          >
            Add link
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to load links. {(error as Error)?.message ?? 'Please try again later.'}
        </div>
      ) : (
        <>
          <LinkList links={links} onEdit={openEditModal} />
          {isFetching && <p className="text-xs text-slate-500">Refreshing…</p>}
          <Pagination page={currentPage} size={PAGE_SIZE} total={total} onPageChange={handlePageChange} />
        </>
      )}

      <LinkFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialValues={
          selectedLink
            ? { url: selectedLink.url, tags: selectedLink.tags, notes: selectedLink.notes ?? '' }
            : undefined
        }
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLink(null);
        }}
        onSubmit={modalMode === 'create' ? handleCreateSubmit : handleUpdateSubmit}
        isSubmitting={modalMode === 'create' ? createMutation.isLoading : updateMutation.isLoading}
        errorMessage={
          modalMode === 'create'
            ? getErrorMessage(createMutation.error)
            : getErrorMessage(updateMutation.error)
        }
      />
    </section>
  );
};

export default LinksPage;
