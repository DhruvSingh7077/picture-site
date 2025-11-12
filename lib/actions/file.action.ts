'use server';

import { UploadFileProps} from "@/types";

const handleError = (error:unknown, message:string) => {
    console.log(error, message);
    throw error;
}
export const uploadFile =async ({
    file,
    ownerId,
    accountId,
    path,
}: UploadFileProps) => {
    const { storage, databases } = await createAdminClient();

    try {   
        const inputFile = InputFile.fromBuffer(file, file.name);

        const bucketFile = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            inputFile,
        ); 
    } catch (error) {
        handleError(error,  'failed to upload file')
    }