const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

app.use(
    cors({
        origin: "*",
        methods: ["POST", "GET"],
        allowedHeaders: ["Content-Type"]
    })
);


/* =========================
   BASIC ROUTE
========================= */

app.get("/", (req, res) => {

    res.json({
        success: true,
        name: "Mysterious",
        message: "Mysterious Knowledge Engine is running."
    });

});


/* =========================
   HEALTH CHECK
========================= */

app.get("/health", (req, res) => {

    res.json({
        status: "online",
        service: "Mysterious Knowledge Engine",
        time: new Date().toISOString()
    });

});


/* =========================
   ASK ENDPOINT
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


        /*
          AI CONNECTION WILL BE ADDED
          IN THE NEXT STEP.

          DO NOT PUT YOUR API KEY HERE.
        */


        return res.json({

            success: true,

            question: question,

            answer:
                "Mysterious ने आपका प्रश्न प्राप्त कर लिया है। " +
                "AI Knowledge Engine अभी connect किया जा रहा है।",

            source: "Mysterious"

        });

    }

    catch (error) {

        console.error(
            "Server Error:",
            error
        );

        res.status(500).json({

            success: false,

            error:
                "Mysterious server में समस्या हुई।"

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
   START SERVER
========================= */

app.listen(PORT, () => {

    console.log(
        `Mysterious server running on port ${PORT}`
    );

});
