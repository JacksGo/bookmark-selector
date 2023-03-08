import { Folder, Link } from "../types/Bookmark";

let id: number;
let folderMap = new Map<number, Folder>();
let dom: Document;

export const parseFile = async (file: File): Promise<[(Folder | Link)[], Map<number, Folder>, Document, number]> => {
  const contents = await file.text();
  const parser = new DOMParser();

  id = 0;
  folderMap = new Map<number, Folder>();

  dom = parser.parseFromString(contents, 'text/html');

  if (!dom.doctype?.name.startsWith('netscape-bookmark-file')) {
    console.error('Provided file is not a bookmarks file.');
    return [
      [],
      new Map(),
      new Document(),
      0,
    ];
  }

  const rootDL = dom.body.querySelector('dl');
  const bookmarks: (Folder | Link)[] = [];

  if (!rootDL) {
    return [
      [],
      new Map(),
      new Document(),
      0,
    ];
  }

  const topLevelChildren = [...rootDL.querySelectorAll(':scope > dt')];
  for (const child of topLevelChildren) {
    bookmarks.push(getBookmarkData(child));
  }

  return [
    bookmarks,
    folderMap,
    dom,
    id,
  ];
}

/**
 * Parse a bookmark item, returning either a `Link` or a `Folder`.
 * @param node An Element representing a bookmark item (DT).
 */
const getBookmarkData = (node: Element): Folder | Link => {
  const thisId = id++;
  const firstChild = node.firstElementChild;

  if (firstChild?.nodeName === 'A') {
    // Item is a link.
    
    const data: Link = {
      type: 'link',
      id: thisId,
      title: firstChild.textContent ?? '',
      added: new Date(parseInt(firstChild.getAttribute('add_date')!) * 1000),
      href: firstChild.getAttribute('href')!,
    }

    return data;
  } else if (firstChild?.nodeName === 'H3') {
    // Item is a folder.

    const data: Folder = {
      type: 'folder',
      id: thisId,
      title: firstChild.textContent ?? '',
      added: new Date(parseInt(firstChild.getAttribute('add_date')!) * 1000),
      items: [],
    }

    if (firstChild.hasAttribute('last_modified')) {
      data.modified = new Date(parseInt(firstChild.getAttribute('last_modified')!) * 1000);
    }

    if (firstChild.getAttribute('PERSONAL_TOOLBAR_FOLDER') === "true") {
      data.personalToolbarFolder = true;
    }

    const items = [];
    const list = node.querySelector('dl');

    if (!list) return data;

    const immediateChildren = [...list.querySelectorAll(':scope > dt')];
    
    for (const child of immediateChildren) {
      items.push(getBookmarkData(child));
    }

    data.items = items;

    folderMap.set(thisId, data);

    return data;
  } else {
    console.error("Unable to determine node type:", node);
    throw new SyntaxError(`Unable to determine node type of ${thisId}`);
  }
}