import { OpenAI } from "openai";
import readline from "readline";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TOKENS_FILE = join(__dirname, "tokens.json");

const client = new OpenAI({
	baseURL: "https://router.huggingface.co/v1",
	apiKey: process.env.HF_TOKEN,
});

const model = "openai/gpt-oss-120b:groq";

/**
 * Translate text from source language to target language
 * @param {string} text - Text to translate
 * @param {string} sourceLang - Source language (e.g., "English", "Spanish", "French")
 * @param {string} targetLang - Target language (e.g., "English", "Spanish", "French")
 * @param {boolean} returnUsage - Whether to return token usage information
 * @returns {Promise<string|{translatedText: string, usage: {input: number, output: number}}>} Translated text or object with translation and usage
 */
async function translate(text, sourceLang = "auto", targetLang = "English", returnUsage = false) {
	try {
		const prompt = sourceLang === "auto" 
			? `Translate the following text to ${targetLang}. Only provide the translation, no explanations or additional text:\n\n${text}`
			: `Translate the following text from ${sourceLang} to ${targetLang}. Only provide the translation, no explanations or additional text:\n\n${text}`;

		const chatCompletion = await client.chat.completions.create({
			model: model,
			messages: [
				{
					role: "system",
					content: "You are a professional translator. Translate accurately and preserve the meaning, tone, and style of the original text."
				},
				{
					role: "user",
					content: prompt,
				},
			],
			temperature: 0.3, // Lower temperature for more consistent translations
		});

		const translatedText = chatCompletion.choices[0].message.content.trim();
		
		// Return usage information if requested
		if (returnUsage && chatCompletion.usage) {
			return {
				translatedText,
				usage: {
					input: chatCompletion.usage.prompt_tokens || 0,
					output: chatCompletion.usage.completion_tokens || 0,
				}
			};
		}
		
		return translatedText;
	} catch (error) {
		console.error("Translation error:", error.message);
		if (error.response) {
			console.error("Response status:", error.response.status);
			console.error("Response data:", error.response.data);
		}
		throw error;
	}
}

/**
 * Save tokens to JSON file
 * @param {number} inputTokens - Input token count
 * @param {number} outputTokens - Output token count
 */
function saveTokens(inputTokens, outputTokens) {
	try {
		let tokens = [];
		if (fs.existsSync(TOKENS_FILE)) {
			const data = fs.readFileSync(TOKENS_FILE, "utf-8");
			tokens = JSON.parse(data);
		}
		tokens.push({
			input: inputTokens,
			output: outputTokens,
		});
		fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2), "utf-8");
	} catch (error) {
		console.error("Error saving tokens:", error);
	}
}

/**
 * Batch translate multiple texts
 * @param {string[]} texts - Array of texts to translate
 * @param {string} sourceLang - Source language
 * @param {string} targetLang - Target language
 * @returns {Promise<string[]>} Array of translated texts
 */
async function translateBatch(texts, sourceLang = "auto", targetLang = "English") {
	const results = [];
	for (const text of texts) {
		const translated = await translate(text, sourceLang, targetLang);
		results.push(translated);
	}
	return results;
}

/**
 * Interactive CLI translator
 */
function startInteractiveTranslator() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	console.log("🌍 Translator powered by GPT-OSS-120B");
	console.log("Type 'exit' or 'quit' to stop\n");

	let sourceLang = "auto";
	let targetLang = "English";

	const askForTranslation = () => {
		rl.question(`[${sourceLang} → ${targetLang}] Enter text to translate: `, async (input) => {
			if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
				console.log("Goodbye! 👋");
				rl.close();
				return;
			}

			if (input.toLowerCase().startsWith("/lang ")) {
				const parts = input.substring(6).split(" to ");
				if (parts.length === 2) {
					sourceLang = parts[0].trim() || "auto";
					targetLang = parts[1].trim();
					console.log(`Language pair updated: ${sourceLang} → ${targetLang}\n`);
				} else {
					console.log("Usage: /lang <source> to <target> (e.g., /lang English to Spanish)");
					console.log("Or: /lang auto to <target> for auto-detect\n");
				}
				askForTranslation();
				return;
			}

			if (!input.trim()) {
				askForTranslation();
				return;
			}

			try {
				process.stdout.write("Translating... ");
				const result = await translate(input, sourceLang, targetLang, true);
				console.log(`\n✓ Translation: ${result.translatedText}`);
				if (result.usage) {
					console.log(`  Tokens: Input=${result.usage.input}, Output=${result.usage.output}`);
					saveTokens(result.usage.input, result.usage.output);
				}
				console.log();
			} catch (error) {
				console.log(`\n✗ Error: ${error.message}\n`);
			}

			askForTranslation();
		});
	};

	askForTranslation();
}

// Export functions for programmatic use
export { translate, translateBatch, startInteractiveTranslator };

// If run directly, start interactive mode
if (process.argv[1] && process.argv[1].endsWith('translator.js')) {
	startInteractiveTranslator();
}

