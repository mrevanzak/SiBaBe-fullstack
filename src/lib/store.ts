import { create } from 'zustand';

type JwtStore = {
  jwt: string | null;
  setJwt: (jwt: string | null) => void;
};

export const useJwtStore = create<JwtStore>()((set) => ({
  jwt: null,
  setJwt: (jwt) => set({ jwt }),
}));
