import fs from "fs";
import path from "path";
import imageType from 'image-type';
import dotenv from "dotenv";

dotenv.config();

const sliceIntoChunks = <T>(arr: T[], chunkSize: number) =>
  Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
    arr.slice(i * chunkSize, (i + 1) * chunkSize)
  );

import type { Index, PineconeRecord } from "@pinecone-database/pinecone";

function* chunkArray<T>(array: T[], chunkSize: number): Generator<T[]> {
  for (let i = 0; i < array.length; i += chunkSize) {
    yield array.slice(i, i + chunkSize);
  }
}

const chunkedUpsert = async (
  index: Index,
  vectors: Array<PineconeRecord>,
  namespace: string,
  chunkSize = 10
) => {
  // Split the vectors into chunks
  const chunks = sliceIntoChunks<PineconeRecord>(vectors, chunkSize);

  try {
    // Upsert each chunk of vectors into the index
    await Promise.allSettled(
      chunks.map(async (chunk) => {
        try {
          await index.namespace(namespace).upsert(chunk);
        } catch (e) {
          console.log("Error upserting chunk", e);
        }
      })
    );

    return true;
  } catch (e) {
    throw new Error(`Error upserting vectors into index: ${e}`);
  }
};
// module.exports = { chunkArray, chunkedUpsert };
const convert_toBase64 = (file: string) => {
  // Convert image type from .png to base64
  // method 1
  const contents = fs.readFileSync(file)
  const b64 = contents.toString('base64')
  const type = imageType(contents)
  console.log(type)
  // console.log(b64)
  // console.log(`data:${type};base64,${b64}`)
  return `data:${type};base64,${b64}`

  // method 2
  // imageDataURI.encodeFromURL('https://example.com/image.png')
  //   .then(dataURI => console.log(dataURI))

  // imageDataURI.encodeFromFile(file)
  //     .then(dataURI => console.log(dataURI))
}

async function imageUrlToBase64(url: string): Promise<string> {
  try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
              if (typeof reader.result === 'string') {
                  resolve(reader.result);
              } else {
                  reject(new Error('Failed to convert the image to Base64.'));
              }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
      });
  } catch (error) {
      throw new Error('Failed to fetch the image: ' + error);
  }
}
// convert_toBase64('./2.png')

async function listFiles(dir: string): Promise<string[]> {
  const files = await fs.promises.readdir(dir);
  const filePaths: string[] = [];
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await fs.promises.stat(filePath);
    if (stats.isFile()) {
      filePaths.push(filePath);
    }
  }
  return filePaths;
}

export const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} environment variable not set`);
  }
  return value;
};

const validateEnvironmentVariables = () => {
  getEnv("PINECONE_API_KEY");
  getEnv("PINECONE_INDEX");
  getEnv("PINECONE_CLOUD");
  getEnv("PINECONE_REGION");
};

export { listFiles, sliceIntoChunks, convert_toBase64, imageUrlToBase64, validateEnvironmentVariables, chunkArray, chunkedUpsert };
