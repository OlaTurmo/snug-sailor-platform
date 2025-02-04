
export type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author_id: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  status: 'published' | 'draft';
  slug: string;
};
