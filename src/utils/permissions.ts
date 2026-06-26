import type { Permission } from "@/types/user";

export function hasPermission(permissions: Permission[], key: Permission) {
  return permissions.includes(key);
}

export function hasAnyPermission(permissions: Permission[], keys: Permission[]) {
  return keys.some((key) => permissions.includes(key));
}

export function hasAllPermissions(permissions: Permission[], keys: Permission[]) {
  return keys.every((key) => permissions.includes(key));
}
