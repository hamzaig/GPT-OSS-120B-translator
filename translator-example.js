import { translate, translateBatch } from "./translator.js";

/**
 * Example usage of the translator
 */
async function examples() {
	try {
		// Example 1: Simple translation
		console.log("Example 1: Simple Translation");
		console.log("=".repeat(50));
		const text1 = "Hello, how are you?";
		const translated1 = await translate(text1, "English", "Spanish");
		console.log(`Original: ${text1}`);
		console.log(`Translated: ${translated1}\n`);

		// Example 2: Auto-detect source language
		console.log("Example 2: Auto-detect Source Language");
		console.log("=".repeat(50));
		const text2 = "Bonjour, comment allez-vous?";
		const translated2 = await translate(text2, "auto", "English");
		console.log(`Original: ${text2}`);
		console.log(`Translated: ${translated2}\n`);

		// Example 3: Translate to multiple languages
		console.log("Example 3: Translate to Multiple Languages");
		console.log("=".repeat(50));
		const text3 = "The weather is beautiful today.";
		const languages = ["Spanish", "French", "German", "Italian"];
		
		for (const lang of languages) {
			const translated = await translate(text3, "English", lang);
			console.log(`${lang}: ${translated}`);
		}
		console.log();

		// Example 4: Batch translation
		console.log("Example 4: Batch Translation");
		console.log("=".repeat(50));
		const texts = [
			"Good morning",
			"Thank you",
			"Please",
			"Excuse me"
		];
		const batchTranslated = await translateBatch(texts, "English", "Spanish");
		texts.forEach((text, index) => {
			console.log(`${text} → ${batchTranslated[index]}`);
		});

	} catch (error) {
		console.error("Error in examples:", error.message);
		process.exit(1);
	}
}

examples();

