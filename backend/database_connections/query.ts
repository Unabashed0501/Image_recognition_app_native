import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.PINECONE_API_KEY);
console.log(process.env.INDEX_NAME);

const indexName: string | undefined = process.env.INDEX_NAME;
const pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
    // environment: process.env.PINECONE_ENVIRONMENT,
});

interface QueryEmbeddingParams {
    values: number[];
    namespace: string;
}

type QueryOptions = {
    topK: number; // number of results desired
    vector: Array<number>; // must match dimension of index
    sparseVector?: {
        indices: Array<number>; // indices must fall within index dimension
        values: Array<number>; // indices and values arrays must have same length
    };
    id?: string;
    includeMetadata: boolean;
    includeValues: boolean;
};

const queryEmbedding = async ({ values, namespace }: QueryEmbeddingParams): Promise<{ label: string; confidence: number }[] | undefined> => {
    const index = pineconeClient.Index(indexName!);
    const queryRequest: QueryOptions = {
        topK: 5,
        vector: values,
        includeMetadata: true,
        includeValues: true,
        // namespace: namespace,
    };
    try {
        const queryResult = await index.query(queryRequest);
        console.log(queryResult.matches)
        return queryResult.matches?.map(match => {
            const metadata: Record<string, any> | undefined = match?.metadata;
            const label: string = metadata?.label ? String(metadata.label) : "Unknown";
            return {
            //   src: metadata ? metadata.imagePath : '',
                label: label,
                confidence: match.score || 0,
            };  
          });
    } catch (e) {
        console.log("failed", e);
        throw new Error("Failed to query embedding");
    }
};

const queryAllEmbeddings = async () => {
    const index = pineconeClient.Index(PINECONE_INDEX!);
    const queryRequest = {
        topK: 1000, // Adjust as needed to potentially retrieve more matches
        vector: [], 
        includeMetadata: true,
        includeValues: true,
    };

    try {
        const queryResult = await index.query(queryRequest);
        return queryResult.matches?.map(match => {
            const metadata = match?.metadata;
            const label = metadata?.label ? String(metadata.label) : "Unknown";
            return {
                label: label,
                metadata: metadata
            };  
        });
    } catch (error) {
        console.error("Failed to query embeddings:", error);
        throw new Error("Failed to query embeddings from the Pinecone index");
    }
};

export { queryEmbedding };
