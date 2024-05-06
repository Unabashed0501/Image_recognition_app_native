import { Router, Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
// import { handleImage, handleDeleteUser, handleEmbedding } from "../handle_image_new.ts";
import Embedder from "../Model/embedder.ts";
import CVPreprocessor from "../Model/cv_preprocessor.ts";
import { queryEmbedding, queryAllEmbeddings, saveEmbedding, deleteNamespace, updateEmbedding } from "../database_connections/pinecone.ts";
import { createRequire } from 'module';

const upload = multer();

interface SaveEmbeddingParams {
    id: string;
    values: number[];
    metadata: Record<string, any>;
    namespace?: string | undefined;
}

export default function api() {
    const router = Router();

    router
        .post("/getEmbedding", async (req: Request, res: Response) => {
            const { imageBase64 } = req.body;
            console.log("in getembeddings api")
            console.log("imageBase64: ", imageBase64);
            // console.log("words: ", words);
            const embedder = new Embedder();
            const jsonEmbeddings = await embedder.getEmbeddings(imageBase64, ['']);

            console.log(jsonEmbeddings);
            // res.send("Response");
            res.send(jsonEmbeddings);
        })
        .post('/getProcessedImage', async (req: Request, res: Response) => {
            const { path } = req.body;
            // console.log("path: ", path);
            const cv_preprocessor = new CVPreprocessor();
            const processedImage = await cv_preprocessor.getProcessedImage(path);

            // for (var i = 0; i < 29; i++) {
            //     console.log(processedImage[i]);
            // }

            const processedImageStr = `data:image/png;base64,${processedImage}`
            if (processedImage == "Not Found") {
                res.send({ "str": "Not Found" });
            }
            else
                res.send({ "str": processedImageStr });
        })
        .post('/query', async (req: Request, res: Response) => {
            try {
                // Extract values and namespace from request body
                const { values, namespace } = req.body;

                // Call queryEmbedding function with extracted parameters
                const result = await queryEmbedding({ values, namespace });
                console.log("result", result);
                // Send the result back as a response
                res.json(result);
            } catch (error) {
                // If an error occurs, send an error response
                console.error('Error querying embedding:', error);
                res.status(500).json({ error: 'Failed to query embedding' });
            }
        })
        .post("/queryAllEmbeddings", async (req: Request, res: Response) => {
            try {
                console.log("in queryAllEmbeddings");
                const result = await queryAllEmbeddings();
                console.log(result);
                res.json(result);
            } catch (error) {
                console.error("Error querying all embeddings:", error);
                res.status(500).json({ error: "Failed to query all embeddings" });
            }
        })
        .post('/updateEmbedding', async (req: Request, res: Response) => {
            try {
                const { id, metadata } = req.body;
                await updateEmbedding(id, metadata);
                res.status(200).json({ message: `Embedding with ID ${id} has been updated successfully.` });
            } catch (error) {
                console.error('Error updating embedding:', error);
                res.status(500).json({ error: 'Failed to update embedding' });
            }
        })
        .post('/saveEmbedding', async (req: any, res: any) => {

            try {
                console.log("in apiapiapiapi");
                const data = req.body;
                console.log("data: ", data)
                const imageBase64 = data.imageBase64;
                const metadata = data.metadata;

                const embedder = new Embedder();
                // const imageBase64 = await imageUrlToBase64(imageDataURI);

                console.log("imageBase64: ", imageBase64);
                console.log("metadata: ", metadata);
                const jsonEmbeddings = await embedder.getEmbeddings(imageBase64, []);

                console.log(jsonEmbeddings);
                const requestData = <SaveEmbeddingParams>{
                    id: metadata.id,
                    values: jsonEmbeddings,
                    metadata: metadata,
                }
                const result = await saveEmbedding(requestData as any);
                res.json(result);
            } catch (error) {
                console.error('Error saving embedding:', error);
                res.status(500).json({ error: 'Failed to save embedding' });
            }
        })
        .post('/deleteNamespace', async (req: Request, res: Response) => {
            try {
                const { namespace } = req.body;
                await deleteNamespace({ namespace });
                res.sendStatus(200);
            } catch (error) {
                console.error('Error deleting namespace:', error);
                res.status(500).json({ error: 'Failed to delete namespace' });
            }
        })
        .use((req, res, next) => {
            if (!req.body) {
                next(new Error('Bad request'));
                return;
            }

            next();
        })
        .use((req, res, next) => {
            res.json({
                error: 'Invalid route',
            });
        });

    return router;
}

import { Buffer } from 'buffer';

async function imageUrlToBase64(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const b64 = buffer.toString('base64');
        return `data:jpeg;base64,${b64}`
    } catch (error) {
        throw new Error(`Failed to fetch the image: ${error}`);
    }
}


