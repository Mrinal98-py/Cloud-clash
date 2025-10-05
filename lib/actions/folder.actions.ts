'use server';

import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { FolderType } from "@/types/folder";

export { }; // Force this file to be a module

interface CreateFolderProps {
  name: string;
  parentId?: string;
  path: string;
}

interface GetFoldersProps {
  parentId?: string;
  searchText?: string;
  type?: string;
}

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const createFolder = async ({ name, parentId, path }: CreateFolderProps) => {
  const { databases } = await createAdminClient();
  const currentUser = await getCurrentUser();

  if (!currentUser) throw new Error("User not found");

  try {
    const folderDocument = {
      name,
      parentId: parentId || null,
      owner: currentUser.$id,
      path: parentId ? `${parentId}/${name}` : name,
      type: path.split('/')[1] as FolderType || 'all',
    };

    const newFolder = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.foldersCollectionId,
      ID.unique(),
      folderDocument,
    );

    revalidatePath(path);
    return parseStringify(newFolder);
  } catch (error) {
    handleError(error, "Failed to create folder");
  }
};

export const getFolders = async ({ parentId, searchText = "", type }: GetFoldersProps) => {
  try {
    // Get database client and user in parallel
    const [{ databases }, currentUser] = await Promise.all([
      createAdminClient(),
      getCurrentUser()
    ]);

    if (!currentUser) {
      console.error("User not found");
      return { documents: [], total: 0 };
    }

    const queries = [Query.equal("owner", currentUser.$id)];

    if (parentId) {
      queries.push(Query.equal("parentId", parentId));
    } else {
      queries.push(Query.isNull("parentId"));
    }

    if (type && type !== 'all') {
      queries.push(Query.or([
        Query.equal("type", type),
        Query.equal("type", "all")
      ]));
    }

    if (searchText) {
      queries.push(Query.contains("name", searchText));
    }

    // Add optimization hints for faster querying
    queries.push(
      Query.limit(100), // Limit to first 100 folders
      Query.orderDesc("$createdAt") // Sort by newest first
    );

    const folders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.foldersCollectionId,
      queries,
    );

    return parseStringify(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    throw new Error('Failed to fetch folders');
  }
};

export const deleteFolder = async (folderId: string, path: string) => {
  const { databases } = await createAdminClient();

  try {
    // Delete the folder
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.foldersCollectionId,
      folderId
    );

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    handleError(error, "Failed to delete folder");
    return { success: false };
  }
};
