import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from "dotenv";
dotenv.config();

const PINECONE_INDEX: string | undefined = process.env.PINECONE_INDEX;
const DIMENSION: number = parseInt(process.env.DIMENSION!);
const pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    // environment: process.env.PINECONE_ENVIRONMENT,
});

const updateEmbedding = async (id: string, newMetadata: Record<string, any>): Promise<void> => {
    try {
        const index = pineconeClient.Index(PINECONE_INDEX!);
        let metadataToUpdate: Record<string, any> = { id: id };
        // console.log(newMetadata);
        for (const key in newMetadata) {
            // Check if the field exists and is not 'id'
            if (Object.prototype.hasOwnProperty.call(newMetadata, key) && key !== 'id') {
                // Update the corresponding field in metadataToUpdate
                metadataToUpdate[key] = newMetadata[key];
            }
        }
        console.log(metadataToUpdate);
        await index.update({
            id: id,
            metadata: metadataToUpdate
        });
        console.log(`Embedding with ID ${id} has been updated successfully.`);
    } catch (error) {
        console.error(`Failed to update embedding with ID ${id}:`, error);
        throw new Error(`Failed to update embedding with ID ${id}`);
    }
};

export default updateEmbedding;