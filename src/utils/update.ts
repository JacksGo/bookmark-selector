import { State } from "../state/store";
import { Folder, Link } from "../types/Bookmark";

/**
 * Check or uncheck all Link items under a given folder.
 * @param state The root reducer state of the application.
 * @returns A mutated state with folder items updated as appropriate.
 */
export const batchUpdateFolder = (state: State, folderId: number, checked: boolean) => {
  const newCheckboxes = [...state.checkboxes];

  const targetFolder = state.folders.get(folderId);

  if (!targetFolder) throw new Error(`ID ${folderId} is not a folder.`);

  const updateRecursive = (items: (Folder | Link)[]) => {
    for (const item of items) {
      if (item.type === 'link') {
        newCheckboxes[item.id] = checked;
      } else {
        newCheckboxes[item.id] = checked;
        updateRecursive(item.items);
      }
    }
  }

  newCheckboxes[folderId] = checked;
  updateRecursive(targetFolder.items);

  return {
    ...state,
    checkboxes: newCheckboxes,
  };
}

/**
 * Recurse tree depth-first to update folder true/false/mixed states.
 * 
 * Note: For single checks, efficiency could be improved by tracking
 * each item's parent at parse time and walking the tree bottom-up, from
 * the updated node to its most elder parent.
 * 
 * @param state The root reducer state of the application.
 * @returns A mutated state with folders updated as appropriate.
 */
export const updateParentCheckedStates = (state: State) => {
  const newCheckboxes = [...state.checkboxes];

  const updateRecursive = (folder: Folder) => {
    let hasUnchecked = false;
    let hasChecked = false;

    for (const item of folder.items) {
      if (item.type === 'folder') {
        // Navigate through the tree depth-first.
        updateRecursive(item);
      }
      
      if (newCheckboxes[item.id] === 'mixed') {
        hasChecked = true;
        hasUnchecked = true;
        break;
      } else if (newCheckboxes[item.id] === false && hasUnchecked === false) {
        hasUnchecked = true;
      } else if (newCheckboxes[item.id] === true && hasChecked === false) {
        hasChecked = true;
      }

      if (hasUnchecked && hasChecked) {
        newCheckboxes[folder.id] = 'mixed'; 
        break;
      }
    }

    if (hasUnchecked && !hasChecked) {
      newCheckboxes[folder.id] = false;
    } else if (!hasUnchecked && hasChecked) {
      newCheckboxes[folder.id] = true;
    } else if (hasChecked && hasUnchecked) {
      newCheckboxes[folder.id] = 'mixed';
    }
  }

  for (const topLevelItem of state.bookmarks) {
    if (topLevelItem.type === 'folder') {
      updateRecursive(topLevelItem);
    }
  }

  return {
    ...state,
    checkboxes: newCheckboxes,
  };
}