import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load local environment variables (if any)
dotenv.config();

// Helper to lazy-get Gemini AI client to avoid startup crashes if key is omitted
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Crucial: Body parser for JSON
  app.use(express.json());

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI Study Coach endpoint
  app.post("/api/coach", async (req, res) => {
    try {
      const { goals, coursesBrief, dsaBrief } = req.body;

      if (!goals) {
        res.status(400).json({ error: "Goals are required" });
        return;
      }

      // Check if API key is present
      if (!process.env.GEMINI_API_KEY) {
        res.status(400).json({
          error: "Gemini API Key is missing. Please configure it in Settings > Secrets.",
          fallback: true,
          studyPlan: `### Fallback Study Plan\nIt looks like the Gemini API Key is not configured yet. Here's a general guide based on your goals:\n\n1. **Focus on consistency:** Solve at least 1 DSA problem daily.\n2. **Target your courses:** Spend 30-45 minutes reviewing theoretical concepts.\n3. **Practical projects:** Apply what you learn in simple code examples.\n\n*Configure your GEMINI_API_KEY secrets to get customized study schedules directly mapped to your exact courses and goals!*`,
          motivationalQuote: "The secret of getting ahead is getting started. – Mark Twain"
        });
        return;
      }

      const client = getGeminiClient();

      const prompt = `You are a professional, encouraging AI Study Coach. Your job is to analyze a developer's learning stats and goals, and generate a customized, highly-actionable study plan and a custom motivational suggestion/quote.
      
      User's Learning Context:
      - Current Goals & Focus: "${goals}"
      - Current Courses: ${coursesBrief || "None enrolled yet"}
      - Solved DSA Problems count: ${dsaBrief || "0 solved"}

      Provide a beautifully structured study plan in clear Markdown format. Make it concrete with steps, timelines, time-management tips (like Pomodoro), and customized to their active courses.
      Also provide a highly relevant, custom-composed motivational suggestion.

      You must response strictly in JSON matching the following schema.
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              studyPlan: {
                type: Type.STRING,
                description: "Detailed, structured study plan in markdown format, with clear bullet points, sections, and bold text.",
              },
              motivationalQuote: {
                type: Type.STRING,
                description: "A customized motivational quote or message relevant to their goals.",
              },
            },
            required: ["studyPlan", "motivationalQuote"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response returned from Gemini");
      }

      const parsed = JSON.parse(responseText.trim());
      res.json(parsed);
    } catch (err: any) {
      console.error("Gemini coach API error:", err);
      res.status(500).json({
        error: "Failed to generate study plan: " + err.message,
        fallback: true,
        studyPlan: `### Study Strategy\nEven during service interruptions, keep moving forward!\n\n- **Incremental daily steps:** Spend 30 minutes reading documentation.\n- **Pair systems:** Anchor your DSA solving with a specific time block morning or evening.\n- **Self-testing:** Do mini quiz sessions after completing sections.`,
        motivationalQuote: "Action is the foundational key to all success. – Pablo Picasso",
      });
    }
  });

  // Client static assets & SPA serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Study Tracker running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
