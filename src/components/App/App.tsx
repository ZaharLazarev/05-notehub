import { keepPreviousData, useQuery } from "@tanstack/react-query";
import css from "./App.module.css";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import { TailSpin } from "react-loader-spinner";
import { useState } from "react";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import { useDebouncedCallback } from "use-debounce";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

function App() {
  const [page, setPage] = useState(1);
  const [query, setNewQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["notes", page, query],
    queryFn: async () => {
      const data = await fetchNotes(page, query);
      return data;
    },
    placeholderData: keepPreviousData,
  });
  const totalPages = data?.totalPages ?? 0;

  const updateQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewQuery(e.target.value);
      setPage(1);
    },
    300
  );

  const onClose = () => {
    setIsModalOpen(false);
  };
  const onSuccess = () => {
    setIsModalOpen(false);
  };
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox updateQuery={updateQuery} />
        {totalPages > 1 && (
          <Pagination setPage={setPage} page={page} totalPages={totalPages} />
        )}
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className={css.button}
        >
          Create note +
        </button>
      </header>
      {data && !isLoading && <NoteList notes={data.notes} />}
      {isLoading && <TailSpin />}
      {isModalOpen && (
        <Modal onClose={onClose}>
          <NoteForm onClose={onClose} onSuccess={onSuccess} />
        </Modal>
      )}
    </div>
  );
}

export default App;
