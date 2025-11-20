import { ModalType, Note } from "../types/note";
import axios from "axios";
const SwaggerUrl = import.meta.env.VITE_NOTEHUB_TOKEN;

export interface NoteServiceType {
  notes: Note[];
  totalPages: number;
}

// interface ModalServiceType {
//   notes: ModalType[];
// }

const ReqUrl = "https://notehub-public.goit.study/api/notes";

export const fetchNotes = async (
  page: number,
  query: string
): Promise<NoteServiceType> => {
  const configurations = {
    params: {
      search: query,
      page: page,
      perPage: 12,
    },
    headers: {
      Authorization: `Bearer ${SwaggerUrl} `,
    },
  };
  const response = await axios.get<NoteServiceType>(ReqUrl, configurations);
  return response.data;
};

export const createNote = async (values: ModalType): Promise<Note> => {
  const response = await axios.post(ReqUrl, values, {
    headers: {
      Authorization: `Bearer ${SwaggerUrl} `,
    },
  });
  return response.data;
};

export const deleteNote = async (id: Note["id"]) => {
  await axios.delete(`${ReqUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${SwaggerUrl} `,
    },
  });
};
