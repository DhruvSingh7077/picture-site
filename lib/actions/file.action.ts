'use server';

import { parseStringify } from '../utils';
import { createAdminClient } from '../appwrite';
import { appwriteConfig } from '../appwrite/config';
import { ID, Models } from 'node-appwrite';
import { getFileType, constructFileUrl } from '../utils';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from './user.actions';
import { Query } from 'node-appwrite';

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const uploadFile = async ({ file, ownerId, accountId, path }: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();

  try {
    // file should be a Buffer here!
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      file, // Buffer only (not File/InputFile)
    );

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountid: accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument,
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, 'failed to create file document');
      });

    revalidatePath(path);

    return parseStringify(newFile);
  } catch (error) {
    handleError(error, 'failed to upload file');
  }
};

const createQueries = (currentUser: Models.Document) => {
  const queries: any[] = [
    Query.or([
      Query.equal('owner', [currentUser.$id]),
      Query.contains('users', [currentUser.email]),
    ]),
  ];
  return queries;
};
export const getFiles = async () => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('User not authenticated');

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      createQueries(currentUser),
    );

    return parseStringify(files);

    const queries = createQueries(currentUser);
  } catch (error) {
    handleError(error, 'failed to get files');
  }
};
