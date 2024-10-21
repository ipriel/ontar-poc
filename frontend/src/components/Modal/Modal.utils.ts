import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../../lib";

type Tag = {
  label: string;
  severity?: "Low" | "Medium" | "High";
};

export type ModalContent = {
  title: string;
  tags?: Tag[];
  component?: JSX.Element;
};

export type ModalState = {
  isVisible: boolean;
  content: ModalContent | null;
};

function updateModal(updater: (oldData: ModalState) => ModalState) {
  queryClient.setQueryData(["modal"], updater);
  queryClient.invalidateQueries({queryKey: ["modal"]});
}

const initialData = {isVisible: false, content: null};

export const useModalManager = () => ({
  open: (content: ModalContent | undefined) => {
    updateModal((oldData: ModalState) => {
      const newData = {...oldData};

      if(content != null) newData.content = content;
      if(newData.content != null) newData.isVisible = true;

      return newData;
    });
  },
  close: () => {
    updateModal(() => {
      return {isVisible: false, content: null};
    });
  },
  setContent: (content: ModalContent) => {
    updateModal((oldData: ModalState) => {
      return {...oldData, ...{content}};
    });
  },
  useModalQuery: () => useQuery({
    queryKey: ["modal"],
    initialData
  })
});