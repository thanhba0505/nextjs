import { create } from "zustand";
import { AuthService } from "@/services/auth.service";
import type { LoginRequest } from "@/types/auth";
import type { Permission, Role, User } from "@/types/user";
import {
  clearAuthCookies,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/utils/tokens";

interface AuthState {
  user: User | null;
  roles: Role[];
  permissions: Permission[];
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  setUser: (payload: {
    user: User;
    roles: Role[];
    permissions: Permission[];
  }) => void;
  clear: () => void;
}

const initialState: Pick<
  AuthState,
  "user" | "roles" | "permissions" | "isAuthenticated" | "loading"
> = {
  user: null,
  roles: [],
  permissions: [],
  isAuthenticated: false,
  loading: false,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,

  setUser: ({ user, roles, permissions }) =>
    set({
      user,
      roles,
      permissions,
      isAuthenticated: true,
    }),

  clear: () => set({ ...initialState }),

  fetchMe: async () => {
    set({ loading: true });
    try {
      const res = await AuthService.me();
      if (!res.success) throw new Error(res.message);
      const currentUser = res.data.user;
      const { roles, permissions, ...user } = currentUser;
      get().setUser({
        user,
        roles: roles ?? [],
        permissions: permissions ?? [],
      });
    } finally {
      set({ loading: false });
    }
  },

  login: async (payload) => {
    set({ loading: true });
    try {
      const res = await AuthService.login(payload);
      if (!res.success) throw new Error(res.message);

      setAccessToken(res.data.token, res.data.exp);
      setRefreshToken(res.data.refresh_token, res.data.refresh_exp);

      await get().fetchMe();
    } catch (error) {
      clearAuthCookies();
      get().clear();
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await AuthService.logout({ refresh_token: refreshToken });
      }
    } finally {
      clearAuthCookies();
      get().clear();
      set({ loading: false });
    }
  },
}));
