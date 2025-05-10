import { GoogleGenerativeAI } from "@google/generative-ai";
import { Embeddings } from "@langchain/core/embeddings";
import { AsyncCaller } from "@langchain/core/utils/async_caller";

export const createGeminiEmbeddings = ({ apiKey }: { apiKey: string }): Embeddings => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  const caller = new AsyncCaller({});

  const embedQuery = async (text: string): Promise<number[]> => {
    const result = await model.embedContent(text);
    return result.embedding.values;
  };

  return {
    async embedDocuments(documents: string[]): Promise<number[][]> {
      const embeddings = await Promise.all(
        documents.map((doc) => embedQuery(doc))
      );
      return embeddings;
    },

    async embedQuery(text: string): Promise<number[]> {
      return embedQuery(text);
    },

    caller
  };
}; 