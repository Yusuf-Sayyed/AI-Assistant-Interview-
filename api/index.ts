import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
const PORT = 3001;

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const openRouterHeaders = {
  "HTTP-Referer": process.env.VERCEL_URL || "http://localhost:5173",
  "X-Title": "Swipe AI Interview Assistant",
};

app.use(cors());
app.use(express.json());

app.post("/api/generate-question", async (req: Request, res: Response) => {
  try {
    const {
      difficulty,
      previousQuestions,
    }: { difficulty: string; previousQuestions: string[] } = req.body;

    const completion = await openrouter.chat.completions.create(
      {
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are an expert interviewer for a full-stack developer role (React/Node.js). Generate one concise, technical interview question of ${difficulty} difficulty. Do not repeat any of these previous questions: ${previousQuestions.join(
              ", "
            )}. Respond with only the question text.`,
          },
        ],
      },
      {
        headers: openRouterHeaders,
      }
    );

    const question = completion.choices[0].message.content;
    res.json({ question });
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    res.status(500).json({ error: "Failed to generate question" });
  }
});

app.post("/api/evaluate-answer", async (req: Request, res: Response) => {
  try {
    const { question, answer }: { question: string; answer: string } = req.body;

    const completion = await openrouter.chat.completions.create(
      {
        // 1. Body
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content: `The interview question was: "${question}". The candidate's answer was: "${answer}". Evaluate the answer for technical accuracy and clarity, and provide a score from 1 to 10. Respond with only the number.`,
          },
        ],
      },
      {
        // 2. Options
        headers: openRouterHeaders,
      }
    );

    const score = parseInt(
      completion.choices[0].message.content?.trim() || "0",
      10
    );
    res.json({ score });
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    res.status(500).json({ score: 0 });
  }
});

app.post("/api/finalize", async (req: Request, res: Response) => {
  try {
    const { questions, candidateInfo } = req.body;

    console.log("Received request body:", req.body);

    if (!Array.isArray(questions) || questions.length === 0) {
      console.error("Invalid questions array:", questions);
      return res.status(400).json({ error: "Questions array is required" });
    }

    const questionsFormatted = questions
      .filter((q) => q.text && q.answer)
      .map(
        (q) => `
        Question: ${q.text || "N/A"}
        Answer: ${q.answer || "N/A"}
        Difficulty: ${q.difficulty || "N/A"}
        Score: ${q.score || 0}
      `
      )
      .join("\n");

    const completion = await openrouter.chat.completions.create(
      {
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are an AI interview evaluator. Analyze these interview answers and provide ONLY a JSON response in this exact format: {"finalScore": number, "summary": string}

            Questions and answers to evaluate:
            ${questionsFormatted}

            Base the final score (0-100) on their performance across all questions.
            In the summary, explain their strengths and areas for improvement.`,
          },
        ],
      },
      {
        headers: openRouterHeaders,
      }
    );

    let responseContent = completion.choices[0].message.content || "{}";
    responseContent = responseContent.replace(/```json\s*|\s*```/g, "").trim();

    console.log("AI Response content:", responseContent); // Debug log

    try {
      const result = JSON.parse(responseContent);
      console.log("Parsed result:", result);

      if (
        typeof result.finalScore !== "number" ||
        typeof result.summary !== "string"
      ) {
        throw new Error("Invalid response format");
      }

      res.json({
        finalScore: result.finalScore,
        summary: result.summary,
      });
    } catch (parseError) {
      console.error("Parse error:", parseError);
      console.error("Raw content:", responseContent);
      res.status(500).json({ error: "Failed to parse AI response" });
    }
  } catch (error) {
    console.error("Error in finalization:", error);
    res.status(500).json({ error: "Failed to finalize interview" });
  }
});

app.listen(PORT, () => {
  console.log(
    `✅ TypeScript Backend server (powered by OpenRouter) is running on http://localhost:${PORT}`
  );
});
