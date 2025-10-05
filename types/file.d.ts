export interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
  folderId?: string | null;
}

export interface GetFilesProps {
  types?: FileType[];
  searchText?: string;
  sort?: string;
  folderId?: string | null;
  limit?: number;
}

export interface DeleteFileProps {
  fileId: string;
  bucketFileId: string;
  path: string;
}

export interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}

export interface UpdateFileUsersProps {
  fileId: string;
  emails: string[];
  path: string;
}
