import express from "express";
import { translate } from "./translator.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const TOKENS_FILE = join(__dirname, "tokens.json");

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

/**
 * Read tokens from JSON file
 */
function readTokens() {
	try {
		if (fs.existsSync(TOKENS_FILE)) {
			const data = fs.readFileSync(TOKENS_FILE, "utf-8");
			return JSON.parse(data);
		}
		return [];
	} catch (error) {
		console.error("Error reading tokens file:", error);
		return [];
	}
}

/**
 * Append token usage to JSON file
 */
function saveTokens(inputTokens, outputTokens) {
	try {
		const tokens = readTokens();
		tokens.push({
			input: inputTokens,
			output: outputTokens,
		});
		fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2), "utf-8");
		console.log(`Tokens saved: input=${inputTokens}, output=${outputTokens}`);
	} catch (error) {
		console.error("Error saving tokens:", error);
	}
}

// API endpoint for translation
app.post("/api/translate", async (req, res) => {
	try {
		const { text, sourceLang, targetLang } = req.body;

		if (!text || !targetLang) {
			return res.status(400).json({
				error: "Missing required fields: text and targetLang are required",
			});
		}

		const result = await translate(
			text,
			sourceLang || "auto",
			targetLang,
			true // Return usage information
		);

		// Save tokens to JSON file
		if (result.usage) {
			saveTokens(result.usage.input, result.usage.output);
		}

		res.json({
			success: true,
			translatedText: result.translatedText,
			sourceLang: sourceLang || "auto",
			targetLang,
			usage: result.usage,
		});
	} catch (error) {
		console.error("Translation API error:", error);
		res.status(500).json({
			error: "Translation failed",
			message: error.message,
		});
	}
});

// Serve the main page
app.get("/", (req, res) => {
	res.sendFile(join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
	console.log(`🌍 Translator UI running at http://localhost:${PORT}`);
	console.log(`Press Ctrl+C to stop`);
});

