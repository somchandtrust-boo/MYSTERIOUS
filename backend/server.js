const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"]
    })
);


/* =========================
   OPENAI CLIENT
========================= */

const apiKey = process.env.OPENAI_API_KEY;

const client = apiKey
    ? new OpenAI({
        apiKey: apiKey
    })
    : null;


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
        aiConfigured: Boolean(apiKey),
        time: new Date().toISOString()
    });

});


/* =========================
   ASK
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


        /* Check API key */

        if (!apiKey) {

            console.error(
                "OPENAI_API_KEY is missing."
            );

            return res.status(500).json({
                success: false,
                error:
                    "OPENAI_API_KEY is not configured in Render."
            });

        }


        /* =========================
           OPENAI REQUEST
        ========================= */

        const response =
            await client.responses.create({

                model: "gpt-5",

                tools: [
                    {
                        type: "web_search"
                    }
                ],

                input: [
                    {
                        role: "system",

                        content:
                            "You are MYSTERIOUS, a powerful " +
                            "multilingual knowledge assistant. " +
                            "Answer in the language used by the " +
                            "user. You understand Hindi, Gujarati " +
                            "and English. Give accurate, useful " +
                            "and understandable answers. " +
                            "For current information, use web search. " +
                            "Never invent facts."
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


        console.log(
            "Question:",
            question
        );

        console.log(
            "Answer generated successfully."
        );


        return res.json({

            success: true,

            question: question,

            answer: answer,

            source:
                "Mysterious AI Knowledge Engine"

        });


    } catch (error) {

        console.error(
            "========== MYSTERIOUS AI ERROR =========="
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Status:",
            error.status
        );

        console.error(
            "Code:",
            error.code
        );

        console.error(
            "Type:",
            error.type
        );

        console.error(
            "Name:",
            error.name
        );

        console.error(
            "=========================================="
        );


        return res.status(500).json({

            success: false,

            error:
                "Mysterious AI request failed.",

            details:
                error.message || "Unknown server error."

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
   SERVER
========================= */

app.listen(PORT, () => {

    console.log(
        `Mysterious server running on port ${PORT}`
    );

});
