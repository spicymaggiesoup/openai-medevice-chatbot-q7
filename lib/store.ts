// store/chatStore.ts
import { create } from "zustand";

export const useChatToken = create<{
  chatToken?: string;
  setChatToken: (v: string) => void;
}>((set) => ({
  chatToken: undefined,
  setChatToken: (v) => set({ chatToken: v }),
}));

export const useUserInfo= create<{
  nickname?: string;
  setNickname: (v: string) => void;

  email?: string;
  setEmail: (v: string) => void;

  password?: string;
  setPassword: (v: string) => void;

  age?: string;
  setAge: (v: string) => void;

  gender?: string;
  setGender: (v: string) => void;

  location?: string;
  setLocation: (v: string) => void;

  address?: string;
  setAddress: (v: string) => void;
}>((set) => ({
  nickname: undefined,
  setNickname: (v) => set({ nickname: v }),

  password: undefined,
  setPassword: (v) => set({ password: v }),

  email: undefined,
  setEmail: (v) => set({ email: v }),

  age: undefined,
  setAge: (v) => set({ age: v }),

  gender: undefined,
  setGender: (v) => set({ gender: v }),

  location: undefined,
  setLocation: (v) => set({ location: v }), //lat,long

  address: undefined,
  setAddress: (v) => set({ address: v }),
}));

export const useUserLocationNew= create<{
  location?: string;
  setLocation: (v: string) => void;

  address?: string;
  setAddress: (v: string) => void;
}>((set) => ({
  location: undefined,
  setLocation: (v) => set({ location: v }), //lat,long

  address: undefined,
  setAddress: (v) => set({ address: v }),
}));

export const useMedicalDepartments= create<{
  department?: string;
  setDepartment: (v: string) => void;
}>((set) => ({
  department: undefined,
  setDepartment: (v) => set({ department: v }),
}));