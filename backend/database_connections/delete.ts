import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from "dotenv";
dotenv.config();

// console.log(process.env.PINECONE_API_KEY);
// console.log(process.env.INDEX_NAME);

const indexName: string | undefined = process.env.PINECONE_INDEX;

const pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    // environment: process.env.PINECONE_ENVIRONMENT,
});

interface DeleteNamespaceParams {
    namespace: string;
}

const deleteNamespace = async ({ namespace }: DeleteNamespaceParams): Promise<void> => {
    const index = pineconeClient.Index(indexName!);
    try {
        await index.namespace(namespace).deleteAll();
        // await index.deleteOne({
        //     deleteAll: true,
        //     namespace,
        // });
    } catch (e) {
        console.log("failed", e);
        throw new Error("Failed to delete namespace");
    }
};

export { deleteNamespace }