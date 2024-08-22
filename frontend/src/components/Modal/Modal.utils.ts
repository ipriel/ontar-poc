import { create } from "zustand";

type Tag = {
  label: string;
  severity?: "Low" | "Medium" | "High";
};

export type ModalContent = {
  title: string;
  tags?: Tag[];
  component?: JSX.Element;
};

type ModalState = {
  isVisible: boolean;
  content: ModalContent | null;
  open: (content?: ModalContent) => void;
  close: () => void;
  setContent: (content: ModalContent) => void;
};

export const useModalStore = create<ModalState>((set) => ({
  isVisible: false,
  content: null,
  open: (content) => {
    if (content) set({ content });

    set((state) => {
      if (state.content == null) return state;

      return { isVisible: true };
    });
  },
  close: () =>
    set({
      isVisible: false,
      content: null,
    }),
  setContent: (content: ModalContent) => {
    set({ content });
  },
}));
