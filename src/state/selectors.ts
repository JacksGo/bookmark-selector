import { State } from "./store";

export const getPhase = (state: State) => state.phase;
export const getAllBookmarks = (state: State) => state.bookmarks;
export const getBookmarkChecked = (id: number) => (state: State) => state.checkboxes[id];

export const getExportState = (state: State) => state;