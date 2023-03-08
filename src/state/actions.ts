import { Folder, Link } from "../types/Bookmark";
import { State } from "./store";

export const SET_PHASE = 'SET_PHASE';
export const SET_ALL_BOOKMARKS = 'SET_ALL_BOOKMARKS';
export const SET_BOOKMARK_CHECKED = 'SET_BOOKMARK_CHECKED';
export const SET_SHIFT_PRESSED = 'SET_SHIFT_PRESSED';
export const SET_DOM_DATA = 'SET_DOM_DATA';
export const SAVE_FILE = 'SAVE_FILE';

export type Action = {
  type: string,
  [key: string]: any,
};

export const setPhase = (phase: State["phase"]): Action => ({
  type: SET_PHASE,
  phase,
});

export const setAllBookmarks = (bookmarks: (Folder | Link)[], folders: Map<number, Folder>, length: number): Action => ({
  type: SET_ALL_BOOKMARKS,
  bookmarks,
  folders,
  length,
});

export const setBookmarkChecked = (id: number, checked: boolean | 'mixed'): Action => ({
  type: SET_BOOKMARK_CHECKED,
  id,
  checked,
});

export const setShiftPressed = (pressed: boolean) => ({
  type: SET_SHIFT_PRESSED,
  pressed,
});

export const setDOMData = (document: Document) => ({
  type: SET_DOM_DATA,
  document,
});