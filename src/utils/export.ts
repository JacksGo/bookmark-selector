import { State } from "../state/store";
import { Folder, Link } from "../types/Bookmark";

declare global {
  interface Window {
    showSaveFilePicker(options?: {excludeAcceptAllOption?: boolean, suggestedName?: string, types?: {description?: string, accept: Record<string, string[]>}[]}): Promise<FileSystemFileHandle[]>
  }
}

export const exportBookmarks = async (state: State) => {
  /**
   * const docClone = state.document.cloneNode(true) as Document;
   * 
   * const allItems = [...docClone.body.querySelectorAll('dt')];
   * 
   * for (let i = 0; i < allItems.length; i++) {
   *   if (state.checkboxes[i] === false) {
   *     allItems[i].remove();
   *   }
   * }
   * 
   * const serializer = new XMLSerializer();
   * const textContent = serializer.serializeToString(docClone);
   */

  const textContent = renderBookmarkHTML(state);

  const date = new Date();

  // Suggested name will be in the format `bookmark_selector_3_4_23.html`.
  const suggestedName = `bookmark_selector_${date.getMonth()+1}_${date.getDate()}_${date.getFullYear().toString().slice(-2)}.html`;

  const dataBlob = new Blob([textContent], { type: 'text/html' });
  const objectURL = window.URL.createObjectURL(dataBlob);

  const a = document.createElement('a');
  a.href = objectURL;
  a.download = suggestedName;

  a.click();

  window.URL.revokeObjectURL(objectURL);
}

/**
 * I’d like to have a word with whoever designed this file format.
 */
const renderBookmarkHTML = (state: State) => {
  let indentLevel = 1;
  
  let output = '<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<!-- This is an automatically generated file.\n     It will be read and overwritten.\n     DO NOT EDIT! -->\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n<DL><p>\n';

  const renderItem = (item: Folder | Link) => {
    // If the item is unchecked, skip it.
    if (state.checkboxes[item.id] === false) return;

    if (item.type === 'folder') {
      const indent = "    ".repeat(indentLevel);
      output += `${indent}<DT><H3 ADD_DATE="${Math.floor(item.added.getTime()/1000)}"${item.modified ? ` LAST_MODIFIED="${Math.floor(item.modified.getTime()/1000)}"` : ''}${item.personalToolbarFolder ? ` PERSONAL_TOOLBAR_FOLDER="true"` : ''}>${item.title}</H3>`
      output += "\n" + indent + "<DL><p>\n";

      indentLevel++;
      
      for (let innerItem of item.items) {
        renderItem(innerItem);
      }

      indentLevel--;

      output += indent + "</DL><p>\n"
    }
    
    if (item.type === 'link') {
      output += "    ".repeat(indentLevel);
      output += `<DT><A HREF="${item.href}" ADD_DATE="${Math.floor(item.added.getTime()/1000)}"${item.modified ? ` LAST_MODIFIED="${Math.floor(item.modified.getTime()/1000)}"` : ''}>${item.title}</A>`;
      output += "\n";
    }
  }

  for (let topLevelItem of state.bookmarks) {
    renderItem(topLevelItem);
  }

  output += '</DL><p>\n'

  return output;
}