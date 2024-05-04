import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

const inferenceEndpointUrl: string = process.env.INFERENCE_ENDPOINT_CV!;
const inferenceEndpointToken: string = process.env.INFERENCE_ENDPOINT_TOKEN_CV!;
const MODEL_API_KEY: string = process.env.MODEL_API_KEY!;

console.log(MODEL_API_KEY)

interface Inputs {
    path: string;
    isurl: boolean;
    key: string;
}
interface Data {
    inputs: Inputs;   
}

export default class CVPreprocessor {
    async getProcessedImage(path: string): Promise<any> {
        const data: Data = {
            inputs: {
                path: path,
                isurl: true,
                key: MODEL_API_KEY,
            }
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

            // Check if the request was successful
            if (!response.ok) {
                throw new Error(`Failed to call API: ${response.statusText}`);
            }

            const resData = await response.json();
            console.log(resData);
            // Parse and return the response JSON
            return resData;
        } catch (error) {
            console.error('Failed to call API:', error);
            throw error;
        }
    }
}

