import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'https://swipe-assignment-omega.vercel.app',
};
app.use(cors(corsOptions));

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// Simplified headers for better compatibility
const openRouterHeaders = {
  "X-Title": "Crisp AI Interview Assistant",
};

app.use(cors());
app.use(express.json());

app.post("/api/generate-question", async (req: Request, res: Response) => {
  try {
    const { difficulty, previousQuestions }: { difficulty: string; previousQuestions: string[] } = req.body;

    // CORRECTED API CALL STRUCTURE
    const completion = await openrouter.chat.completions.create(
      { // 1. Body
        model: "deepseek/deepseek-chat",
        messages: [{
          role: "system",
          content: `You are an expert interviewer for a full-stack developer role (React/Node.js). Generate one concise, technical interview question of ${difficulty} difficulty. Do not repeat any of these previous questions: ${previousQuestions.join(", ")}. Respond with only the question text.`,
        }],
      },
      { // 2. Options
        headers: openRouterHeaders,
      }
    );

    const question = completion.choices[0].message.content;
    res.json({ question });
  } catch (error) {
    console.error("Error calling OpenRouter API in /generate-question:", error);
    res.status(500).json({ error: "Failed to generate question" });
  }
});

app.post("/api/evaluate-answer", async (req: Request, res: Response) => {
  try {
    const { question, answer }: { question: string; answer: string } = req.body;

    // CORRECTED API CALL STRUCTURE
    const completion = await openrouter.chat.completions.create(
      { // 1. Body
        model: "deepseek/deepseek-chat",
        messages: [{
          role: "system",
          content: `The interview question was: "${question}". The candidate's answer was: "${answer}". Evaluate the answer for technical accuracy and clarity, and provide a score from 1 to 10. Respond with only the number.`,
        }],
      },
      { // 2. Options
        headers: openRouterHeaders,
      }
    );

    const score = parseInt(completion.choices[0].message.content?.trim() || "0", 10);
    res.json({ score });
  } catch (error) {
    console.error("Error calling OpenRouter API in /evaluate-answer:", error);
    res.status(500).json({ score: 0 });
  }
});

app.post("/api/finalize", async (req: Request, res: Response) => {
    try {
        const { questions } = req.body; // Removed unused candidateInfo

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: "Questions array is required and must not be empty" });
        }

        const questionsFormatted = questions
            .map(q => `Question: ${q.text || "N/A"}\nAnswer: ${q.answer || "N/A"}\nScore: ${q.score || 0}`)
            .join("\n\n");

        // CORRECTED API CALL STRUCTURE
        const completion = await openrouter.chat.completions.create(
            { // 1. Body
                model: "deepseek/deepseek-chat",
                messages: [{
                    role: "system",
                    content: `You are an AI interview evaluator. Analyze these interview answers and provide ONLY a JSON object in this exact format: {"finalScore": number, "summary": string}. Base the final score (0-100) on their performance across all questions. In the summary, explain their strengths and areas for improvement.\n\nTranscript:\n${questionsFormatted}`,
                }],
            },
            { // 2. Options
                headers: openRouterHeaders,
            }
        );

        let responseContent = completion.choices[0].message.content || "{}";
        responseContent = responseContent.replace(/```json\s*|\s*```/g, "").trim();

        const result = JSON.parse(responseContent);
        res.json({
            finalScore: result.finalScore,
            summary: result.summary,
        });

    } catch (error) {
        console.error("Error in /finalize:", error);
        res.status(500).json({ error: "Failed to finalize interview" });
    }
});

// Export the app for Vercel
export default app;