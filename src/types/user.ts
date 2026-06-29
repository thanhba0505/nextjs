export interface Role {
  id: number;
  name: string;
  code: string;
  is_admin?: boolean;
}

export type Permission = string;

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
}

export interface CurrentUser extends User {
  roles: Role[];
  permissions: Permission[];
}
