import { db } from "@/app/db";
import { createGeminiEmbeddings } from "@/lib/gemini-embeddings";
import { pinecone } from "@/lib/pinecone";
import { sendMessageValidator } from "@/lib/validators/send-message-validator";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Document } from "@langchain/core/documents";
import { PineconeStore } from "@langchain/pinecone";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) return new Response("Unauthorized", { status: 404 });
    const userId = user.id;

    const { data, error } = sendMessageValidator.safeParse(body);

    if (error) {
      return new Response("Server Error Encountered", { status: 500 });
    }

    const file = await db.file.findFirst({
      where: {
        id: data?.fileId,
        userId,
      },
    });
    if (!file) {
      return new Response("File Not found", { status: 404 });
    }

    await db.message.create({
      data: {
        text: data.message,
        isUserMessage: true,
        userId,
        fileId: data.fileId,
      },
    });

    // LLM integration
    const embeddings = createGeminiEmbeddings({
      apiKey: process.env.GEMINI_API_KEY || "",
    });
    const pineconeIndex = pinecone.Index("quill");
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: data.fileId,
    });
    const results = await vectorStore.similaritySearch(data.message, 4);

    const prevMessages = await db.message.findMany({
      where: {
        fileId: data.fileId,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 6,
    });

    const formattedMessage = prevMessages.map((msg) => ({
      role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
      content: msg.text,
    }));

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedMessage
    .map((message) => {
      if (message.role === "user") return `User: ${message.content}\n`;
      return `Assistant: ${message.content}\n`;
    })
    .join("")}
  
  \n----------------\n
  
  CONTEXT:
  ${results.map((r: Document) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${data.message}`;

    const result = await model.generateContentStream(prompt);

    const encoder = new TextEncoder();
    // const decoder = new TextDecoder();

    let fullText = "";
    // let hasError = false;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            fullText += text;
            // Format as SSE
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }

          // Save the complete message to the database
          await db.message.create({
            data: {
              text: fullText,
              isUserMessage: false,
              userId,
              fileId: data.fileId,
            },
          });

          // Send completion event
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
          controller.close();
        } catch (error) {
          // hasError = true;
          console.error("Streaming error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                error: "An error occurred while generating the response",
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Request error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
