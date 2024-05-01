import {
    Pinecone,
    type PineconeRecord,
    type ServerlessSpecCloudEnum,
} from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import Embedder from "../Model/embedder.ts";
import { chunkedUpsert } from "../Model/util.ts";

dotenv.config();
const embedder = new Embedder();
// Use the functions from the 'util' object
// const chunkArray = util.chunkArray;
// const chunkedUpsert = util.chunkedUpsert;

console.log(process.env.PINECONE_API_KEY);
console.log(process.env.INDEX_NAME);

const indexName: string | undefined = process.env.INDEX_NAME;
const pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    // environment: process.env.PINECONE_ENVIRONMENT,
});

interface SaveEmbeddingParams {
    id: string;
    values: number[];
    metadata: Record<string, any>;
    namespace: string;
}

// async function embedAndUpsert({
//     imagePaths,
//     chunkSize,
// }: {
//     imagePaths: string[];
//     chunkSize: number;
// }) {
//     // Chunk the image paths into batches of size chunkSize
//     const chunkGenerator = chunkArray(imagePaths, chunkSize);

//     // Get the index
//     const index = pineconeClient.index(indexName!);

//     // Embed each batch and upsert the embeddings into the index
//     for await (const imagePaths of chunkGenerator) {
//         await embedder.embedBatch(
//             imagePaths,
//             chunkSize,
//             async (embeddings: PineconeRecord[]) => {
//                 await chunkedUpsert(index, embeddings, "default");
//             }
//         );
//     }
// }

const saveEmbedding = async ({ id, values, metadata, namespace }: SaveEmbeddingParams): Promise<{ message: string }> => {
    const index = pineconeClient.Index(indexName!);
    const upsertRequest: PineconeRecord[] = [{
        id: id,
        values: values,
        metadata: metadata
    }];
    try {

        const response = await index.upsert(upsertRequest);
        console.log("response", response);
        return {
            message: "training",
        };
        // return response?.upsertedCount > 0
        //     ? {
        //         message: "training",
        //     }
        //     : {
        //         message: "failed training",
        //     };
    } catch (e) {
        console.log("failed", e);
        throw new Error("Failed to save embedding");
    }
};


export { saveEmbedding };
