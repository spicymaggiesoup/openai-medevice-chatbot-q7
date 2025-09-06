// store/chatStore.ts
import { create } from "zustand";

export const useChatToken = create<{
    chatToken?: string;
    setChatToken: (v: string) => void;
}>((set) => ({
  chatToken: undefined,
  setChatToken: (v) => set({ chatToken: v }),
}));

export const useMedicalDepartments= create<{
    department?: string;
    setDepartment: (v: string) => void;
}>((set) => ({
  department: undefined,
  setDepartment: (v) => set({ department: v }),
}));
