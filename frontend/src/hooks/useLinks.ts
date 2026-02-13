import { useQuery } from '@tanstack/react-query';

import { getLinks } from '../api/links';
import { linkKeys } from '../api/queryKeys';
import { LinksQueryParams } from '../api/types';

export const useLinks = (params: LinksQueryParams) => {
  return useQuery({
    queryKey: linkKeys.list(params),
    queryFn: () => getLinks(params),
    keepPreviousData: true,
  });
};
