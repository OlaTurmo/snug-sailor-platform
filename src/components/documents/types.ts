
export interface DocumentItem {
  id: string;
  name: string;
  file_path: string;
  created_at: string;
  file_type: string;
  sort_order: number;
  tags: string[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export type SortField = 'name' | 'created_at' | 'file_type' | 'sort_order';
export type SortOrder = 'asc' | 'desc';
