import { apiClient } from './client';
import {
  CreateLinkPayload,
  Link,
  LinkDto,
  LinksQueryParams,
  LinksResponseDto,
  UpdateLinkPayload,
} from './types';

const mapLink = (dto: LinkDto): Link => ({
  ...dto,
  imageUrl: dto.image_url,
});

export const getLinks = async (params: LinksQueryParams = {}) => {
  const { data } = await apiClient.get<LinksResponseDto>('/links', { params });
  return {
    ...data,
    items: data.items.map(mapLink),
  };
};

export const createLink = async (payload: CreateLinkPayload): Promise<Link> => {
  const { data } = await apiClient.post<LinkDto>('/links', payload);
  return mapLink(data);
};

export const updateLink = async (id: number, payload: UpdateLinkPayload): Promise<Link> => {
  const { data } = await apiClient.patch<LinkDto>(`/links/${id}`, payload);
  return mapLink(data);
};
