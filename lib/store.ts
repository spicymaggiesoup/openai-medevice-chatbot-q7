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
    setNickName: (v: string) => void;
    email?: string;
    setEmail: (v: string) => void;
    age?: string;
    setAge: (v: string) => void;
    gender?: string;
    setGender: (v: string) => void;
    location?: string;
    setLocation: (v: string) => void;
}>((set) => ({
    nickname: undefined,
    setNickName: (v) => set({ nickname: v }),
    email: undefined,
    setEmail: (v) => set({ email: v }),
    age: undefined,
    setAge: (v) => set({ age: v }),
    gender: undefined,
    setGender: (v) => set({ gender: v }),
    location: undefined,
    setLocation: (v) => set({ location: v }), //lat,long
}));

export const useMedicalDepartments= create<{
    department?: string;
    setDepartment: (v: string) => void;
}>((set) => ({
  department: undefined,
  setDepartment: (v) => set({ department: v }),
}));