export interface LinkDto {
  id: number;
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  notes: string | null;
  tags: string[];
}

export interface Link extends Omit<LinkDto, 'image_url'> {
  imageUrl: string | null;
}

export interface LinksResponseDto {
  items: LinkDto[];
  total: number;
  page: number;
  size: number;
}

export interface LinksQueryParams {
  search?: string;
  tag?: string;
  page?: number;
  size?: number;
}

export interface CreateLinkPayload {
  url: string;
  tags?: string[];
  notes?: string;
}

export interface UpdateLinkPayload {
  notes?: string;
  tags?: string[];
}
