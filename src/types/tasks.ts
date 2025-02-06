
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  deadline: string | null;
  assigned_to: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  project_id: string | null;
}
