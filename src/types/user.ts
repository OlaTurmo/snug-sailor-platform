export type UserRole = 'responsible_heir' | 'heir' | 'collaborator' | 'view_only';

export type Permission = 'full_edit' | 'comment_only' | 'view_only';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EstateProject {
  id: string;
  name: string;
  responsibleHeirId: string;
  users: ProjectUser[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectUser {
  userId: string;
  projectId: string;
  role: UserRole;
  permissions: Permission[];
}