import AxiosClient from "@/lib/axios-client/axiosClient";
import { signUpformSchema } from "@/types/SignUpFormSchema";
import { z } from "zod";
import { create } from "zustand";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  isLogged: boolean;
  favorites: string[];
}

interface AuthStore {
  user: User;
  isLoading: boolean;
  signup: (data: z.infer<typeof signUpformSchema>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadSession: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: {} as User,
  isLoading: true,

  signup: async (data: z.infer<typeof signUpformSchema>) => {
    await AxiosClient()
      .post("/auth/register", {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        const user: User = response.data.data.user;
        user.isLogged = true;

        localStorage.setItem("TOKEN", response.data.data.token);
        set({
          user: user,
          isLoading: false,
        });
      })
      .catch((error) => {
        set({ user: {} as User, isLoading: false });
        throw error.response.data.message;
      });
  },

  login: async (email: string, password: string) => {
    await AxiosClient()
      .post("/auth/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        const user: User = response.data.data.user;
        user.isLogged = true;

        localStorage.setItem("TOKEN", response.data.data.token);
        set({
          user: user,
          isLoading: false,
        });
      })
      .catch((error) => {
        set({ user: {} as User, isLoading: false });
        throw error.response.data.message;
      });
  },

  logout: () => {
    const updatedUser: User = {} as User;
    set({ user: updatedUser });
    localStorage.removeItem("TOKEN");
  },

  loadSession: async () => {
    if (!localStorage.getItem("TOKEN")) {
      set({ user: {} as User, isLoading: false });
      return;
    }

    await AxiosClient()
      .get("/auth/validate")
      .then((response) => {
        const user: User = response.data.data;
        user.isLogged = true;
        set({
          user: user,
          isLoading: false,
        });
      })
      .catch((error) => {
        error.response.status === 401 && localStorage.removeItem("TOKEN");
        set({ user: {} as User, isLoading: false });
      });
  },
}));

export default useAuthStore;
