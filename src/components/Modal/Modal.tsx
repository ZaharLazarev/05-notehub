import { useEffect } from "react";
import css from "./Modal.module.css";
import { createPortal } from "react-dom";
import NoteForm from "../NoteForm/NoteForm";
import { FormikHelpers } from "formik";
import { createNote } from "../../services/noteService";
import { ModalType, Note } from "../../types/note";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function Modal({ onClose, onSuccess }: ModalProps) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation<Note, Error, ModalType>({
    mutationFn: (values) => createNote(values),
  });
  const handleSubmit = (
    values: ModalType,
    actions: FormikHelpers<ModalType>
  ) => {
    actions.resetForm();
    mutate(
      {
        title: values.title,
        content: values.content,
        tag: values.tag,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["notes"] });
          onSuccess();
        },
        onError: () => {
          toast("Nothing to add");
        },
      }
    );
  };
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <NoteForm handleSubmit={handleSubmit} />
      </div>
    </div>,
    document.body
  );
}
