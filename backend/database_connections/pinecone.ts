import { queryEmbedding, queryAllEmbeddings } from "./query.ts";
import { saveEmbedding } from "./upsert.ts";
import { deleteNamespace } from "./delete.ts";
import updateEmbedding from "./modify.ts";

export { queryEmbedding, queryAllEmbeddings, updateEmbedding, saveEmbedding, deleteNamespace } // embedAndUpsert