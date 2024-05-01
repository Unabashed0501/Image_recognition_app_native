import { Router, Request, Response } from 'express';
// import { handleImage, handleDeleteUser, handleEmbedding } from "../handle_image_new.ts";
import Embedder from "../Model/embedder.ts";
import { queryEmbedding, saveEmbedding, deleteNamespace } from "../database_connections/pinecone.ts";
import { createRequire } from 'module';

export default function api() {
    const router = Router();

    router
        .post("/getEmbedding", async (req: Request, res: Response) => {
            const { imageBase64, words } = req.body;
            const embedder = new Embedder();
            const jsonEmbeddings = await embedder.getEmbeddings(imageBase64, words);

            console.log(jsonEmbeddings);
            // res.send("Response");
            res.send(jsonEmbeddings);
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
        .post('/saveEmbedding', async (req: Request, res: Response) => {
            try {
                const result = await saveEmbedding(req.body);
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