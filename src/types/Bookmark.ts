export type Item = {
  type: "folder" | "link";
  id: number;
  title: string;
  added: Date;
  modified?: Date;
};

export interface Folder extends Item {
  type: "folder";
  personalToolbarFolder?: boolean;
  items: (Folder | Link)[];
};

export interface Link extends Item {
  type: "link";
  href: string;
  icon?: string;
};
