export type DAppCategory = 'DeFi' | 'NFT' | 'Gaming' | 'Infrastructure' | 'Social' | 'Other';

export interface DApp {
  id: string;
  name: string;
  description: string;
  category: DAppCategory;
  websiteUrl: string;
  logoUrl?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  contactEmail: string;
  features: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DAppListResponse {
  data: DApp[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface DAppDetailResponse {
  data: DApp;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CategoriesResponse {
  data: Category[];
}
