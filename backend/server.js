const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;


/* =========================
   MIDDLEWARE
========================= */

app.use(express.json({ limit: "1mb" }));

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"]
    })
);


/* =========================
   OPENAI
========================= */

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


/* =========================
   HOME
========================= */

app.get("/", (req, res) => {

    res.json({
        success: true,
        name: "Mysterious",
        service: "AI Knowledge Engine",
        status: "online"
    });

});


/* =========================
   HEALTH
========================= */

app.get("/health", (req, res) => {

    res.json({
        success: true,
        status: "online",
        aiConfigured:
            Boolean(process.env.OPENAI_API_KEY),
        time: new Date().toISOString()
    });

});


/* =========================
   ASK AI
========================= */

app.post("/ask", async (req, res) => {

    try {

        const question =
            typeof req.body.question === "string"
                ? req.body.question.trim()
                : "";


        if (!question) {

            return res.status(400).json({
                success: false,
                error: "Question is required."
            });

        }


        if (!process.env.OPENAI_API_KEY) {

            return res.status(500).json({
                success: false,
                error:
                    "AI service is not configured on the server."
            });

        }


        const response =
            await client.responses.create({

                model: "gpt-5.6-luna",

                tools: [
                    {
                        type: "web_search"
                    }
                ],

                input: [
                    {
                        role: "system",
                        content:
                            "You are MYSTERIOUS, a multilingual " +
                            "knowledge assistant. Answer clearly " +
                            "and accurately. The user may ask in " +
                            "Hindi, Gujarati, or English. " +
                            "Reply primarily in the language used " +
                            "by the user. For current or changing " +
                            "information, use web search. " +
                            "Do not invent facts."
                    },
                    {
                        role: "user",
                        content: question
                    }
                ]

            });


        const answer =
            response.output_text ||
            "Mysterious could not generate an answer.";


        res.json({

            success: true,

            question: question,

            answer: answer,

            source: "Mysterious AI Knowledge Engine"

        });


    } catch (error) {

        console.error(
            "Mysterious AI Error:",
            error
        );


        res.status(500).json({

            success: false,

            error:
                "Mysterious AI service में समस्या हुई।"

        });

    }

});


/* =========================
   404
========================= */

app.use((req, res) => {

    res.status(404).json({

        success: false,

        error: "Route not found."

    });

});


/* =========================
   START
========================= */

app.listen(PORT, () => {

    console.log(
        `Mysterious AI server running on port ${PORT}`
    );

});
