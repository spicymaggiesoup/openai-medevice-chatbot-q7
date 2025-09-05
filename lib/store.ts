// store/chatStore.ts
import { create } from "zustand";

export const useChatToken = create<{
    chatToken?: string;
    setChatToken: (v: string) => void;
}>((set) => ({
  chatToken: undefined,
  setChatToken: (v) => set({ chatToken: v }),
}));
