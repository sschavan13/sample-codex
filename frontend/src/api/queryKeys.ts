import { LinksQueryParams } from './types';

export const linkKeys = {
  all: ['links'] as const,
  list: (params: LinksQueryParams) => ['links', params] as const,
};
