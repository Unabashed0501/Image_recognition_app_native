import { createHash } from 'crypto';
import { sliceIntoChunks, convert_toBase64 } from './util.ts';
import type { RecordMetadata, PineconeRecord } from "@pinecone-database/pinecone";
import fetch from 'node-fetch';
import dotenv from 'dotenv';


dotenv.config();

interface Inputs {
  image: string;
  text: string[];
}

interface Data {
  inputs: Inputs;
}

const inferenceEndpointUrl: string = process.env.INFERENCE_ENDPOINT!;
const inferenceEndpointToken: string = process.env.INFERENCE_ENDPOINT_TOKEN!;
console.log(inferenceEndpointUrl, inferenceEndpointToken);

export default class Embedder {

  async getEmbeddings (imageBase64: string, words: string[]): Promise<number[] | undefined> {
    const data: Data = {
      inputs: {
        image: imageBase64,
        text: words && words.length > 0 ? words : ['default']
      },
    };
    console.log("data: ", data);
    try {
      if (!inferenceEndpointUrl || !inferenceEndpointToken) {
        throw new Error('Inference endpoint URL or token is missing.');
      }

      // Fetch inference results from the Hugging Face model endpoint
      const response = await fetch(inferenceEndpointUrl, {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${inferenceEndpointToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });

      // console.log(response);
      const json = await response.json();
      console.log("json: ", json);

      const embeddings = (json as { embeddings: number[] }).embeddings;
      console.log("embeddings:", embeddings);
      
      return embeddings;
    } catch (e) {
      console.log('Failed to get embeddings', e);
    }
  }

  async embed(imagePath: string, words: string[], metadata?: RecordMetadata): Promise<PineconeRecord> {
    try {

      // Get embeddings for the image and words
      const embeddings = await this.getEmbeddings(imagePath, words);

      // Create an id for the image
      const id = createHash('md5').update(imagePath).digest('hex');

      // Return the embedding in a format ready for Pinecone
      return {
        id: id.toString(),
        metadata: metadata || { imagePath },
        values: embeddings as number[], // Assuming getEmbeddings returns an array of numbers
      };
    } catch (e) {
      console.log(`Error embedding image, ${e}`);
      throw e;
    }
  }

  async embedBatch(imagePaths: string[], batchSize: number, onDoneBatch: (embeddings: PineconeRecord[]) => void) {
    const batches = sliceIntoChunks<string>(imagePaths, batchSize);
    for (const batch of batches) {
      const embeddings = await Promise.all(batch.map(async (imagePath) => {
        // Read the image and convert to base64
        // const image = await RawImage.read(imagePath);
        const imageBase64 = convert_toBase64(imagePath);
        // const imageBase64 = image.toBase64();

        // Get embeddings for the image and words
        const words = ['default']; // Default words if not provided
        const embeddings = await this.getEmbeddings(imageBase64, words);

        // Create an id for the image
        const id = createHash('md5').update(imagePath).digest('hex');

        return {
          id: id.toString(),
          metadata: { imagePath },
          values: embeddings as number[], // Assuming getEmbeddings returns an array of numbers
        };
      }));

      onDoneBatch(embeddings);
    }
  }
}

// const embedder = new Embedder();
// export { embedder };
