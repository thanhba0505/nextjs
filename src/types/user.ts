export interface Role {
  id: number;
  name: string;
  code: string;
}

export type Permission = string;

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CurrentUser extends User {
  roles: Role[];
  permissions: Permission[];
}
