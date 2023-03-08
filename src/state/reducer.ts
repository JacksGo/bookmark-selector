import { createContext, useReducer } from "react";
import { exportBookmarks } from "../utils/export";
import { batchUpdateFolder, updateParentCheckedStates } from "../utils/update";
import { Action, SAVE_FILE, SET_ALL_BOOKMARKS, SET_BOOKMARK_CHECKED, SET_DOM_DATA, SET_PHASE, SET_SHIFT_PRESSED } from "./actions";
import { initialState, State } from "./store";

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_PHASE:
      return {
        ...state,
        phase: action.phase,
      };
    
    case SET_ALL_BOOKMARKS:
      return {
        phase: 'edit',
        bookmarks: action.bookmarks,
        folders: action.folders,
        checkboxes: [...Array(action.length)].fill(true),

        shiftPressed: false,
        lastChangedId: null,

        document: action.document,
      };

    // @TODO For each containing folder, update its state to mixed, true, or false based on its 
    // members. I think the easiest way to do this is to tunnel upwards to the top-level containing
    // folder. We could cache an array of `dependents` for each bookmark, such that a Link two
    // levels deep would have a dependents array of length two. When processing setBookmarkChecked,
    // we visit each dependent index, check its items, and update the checked status of the folder
    // according to the items within. Going bottom up works well here. Wait a minute. For each
    // folder, just track its immediate folder ancestor. When we update a Link checkbox, iterate
    // backwards until we find a folder, then hop from ancestor to ancestor outwards to the top
    // level, updating each checkbox as we go! We should still track bounds [firstId, lastId] for
    // each folder, though, to make the updating easier. So, `parent: number` and
    // `bounds: [number, number]`? Actually we don't really need start bound, since that's just folder id+1

    // @TODO Handle checking and unchecking folders to check/uncheck all of its contents.
    // If we track a folders min and max ID, we can then iterate over the subset, since
    // a folder's bookmarks are, by implementation, guaranteed to be sequential.
    // When a folder goes from unchecked/mixed to checked or checked to unchecked, set all items
    // within `bounds` to true. This includes folders, since all of those folders' items will be
    // true as well, so we can skip that calculation. We will need to hop upwards through
    // ancestors, though, as described in the previous block, to update the parent folders' states.

    // @TODO Track most recent checkbox click. If shift is held while clicking a checkbox, span
    // between the two and set all in between items to whatever the last item's change is.
    // i.e., if you uncheck item a, hold shift, then check item d, items a through d should be
    // checked. This is how Gmail behaves. This will require some moderate logic to recalculate
    // folder states, but it shouldn't be too hard since ID's are sequential. For all Links in
    // between, set to the appropriate state. Then work backwards from the endpoint, visiting
    // all Folders and iteratively calculating their true/false/mixed state.

    // Ignore folders in the range when shift-checking.
    case SET_BOOKMARK_CHECKED:
      if (state.checkboxes.length <= action.id) {
        console.warn(`Unable to change state of nonexistent item ${action.id}`);
        return state;
      }

      if (state.lastChangedId !== null && state.shiftPressed) {
        const newCheckboxes = [...state.checkboxes];
        const [start, end] = [Math.min(action.id, state.lastChangedId), Math.max(action.id, state.lastChangedId)];
        for (let i = start; i <= end; i++) {
          newCheckboxes[i] = action.checked;
        }

        let updated = {...state, checkboxes: newCheckboxes};

        // If the end of a range is a folder, check all of the items in that folder as well.
        if (state.folders.has(action.id)) {
          updated = batchUpdateFolder(updated, action.id, action.checked);
        }

        const parentsUpdated = updateParentCheckedStates(updated);
        return {
          ...parentsUpdated,
          lastChangedId: action.id,
        }
      }
      
      if (!state.folders.has(action.id)) {
        const newCheckboxes = [...state.checkboxes];
        newCheckboxes[action.id] = action.checked;

        return updateParentCheckedStates({
          ...state,
          checkboxes: newCheckboxes,
          lastChangedId: action.id,
        });
      }

      const batched = batchUpdateFolder(state, action.id, action.checked);
      return {
        ...updateParentCheckedStates(batched),
        lastChangedId: action.id,
      };

    case SET_SHIFT_PRESSED:
      return {
        ...state,
        shiftPressed: action.pressed,
      };

    case SET_DOM_DATA:
      return {
        ...state,
        document: action.document,
      }

    default:
      return state;
  }
}

export const useStateProvider = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const useSelector = <T>(callback: (state: State) => T): T => callback(state);

  return [
    useSelector,
    dispatch,
  ] as const;
};

export const StateContext = createContext([
  () => {},
  () => {},
] as [
  <T>(callback: (state: State) => T) => T,
  React.Dispatch<Action>
]);