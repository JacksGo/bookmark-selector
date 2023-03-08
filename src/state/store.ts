import { Folder, Link } from "../types/Bookmark";

export type State = {
  phase: 'upload' | 'loading' | 'edit',
  bookmarks: (Folder | Link)[],
  folders: Map<number, Folder>,
  checkboxes: (boolean | "mixed")[],

  shiftPressed: boolean,
  lastChangedId: number | null,

  document: Document,
}

export const initialState: State = {
  phase: 'upload',
  bookmarks: [],
  folders: new Map<number, Folder>(),
  checkboxes: [],

  shiftPressed: false,
  lastChangedId: null,

  document: new Document(),
};