export type FolderType = "image" | "video" | "document" | "audio" | "other" | "all";

export interface Folder {
  $id: string;
  name: string;
  parentId: string | null;
  owner: string;
  path: string;
  type: FolderType;
  $createdAt: string;
  $updatedAt: string;
}

export interface CreateFolderProps {
  name: string;
  parentId?: string;
  path: string;
}

export interface GetFoldersProps {
  parentId?: string;
  searchText?: string;
  sort?: string;
}

export interface DeleteFolderProps {
  folderId: string;
  path: string;
}
