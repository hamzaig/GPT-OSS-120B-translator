import { OpenAI } from "openai";
import fs from "fs";

const client = new OpenAI({
	baseURL: "https://router.huggingface.co/v1",
	apiKey: process.env.HF_TOKEN,
});

async function testChatCompletion() {
	try {
		// Read countries.json file
		const countriesData = JSON.parse(fs.readFileSync("countries.json", "utf-8"));
		
		// Create prompt to add all states for each country
		const prompt = `Based on the following list of countries in JSON format, please provide all states/provinces/regions for each country that has them. Return the data in JSON format with the following structure:
{
  "locations": [
    {
      "country": "Country Name",
      "alpha2": "XX",
      "alpha3": "XXX",
      "states": [
        {
          "name": "State/Province Name",
          "code": "State Code (if available)"
        }
      ]
    }
  ]
}

If a country doesn't have states/provinces/regions (like small island nations), include an empty states array.

Here are the countries:
${JSON.stringify(countriesData, null, 2)}`;

		const chatCompletion = await client.chat.completions.create({
			model: "openai/gpt-oss-120b:groq",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
		});

		// Extract the response content
		const responseContent = chatCompletion.choices[0].message.content;
		
		// Parse the JSON response
		// Try to extract JSON from markdown code blocks if present
		let jsonString = responseContent;
		const jsonMatch = responseContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
		if (jsonMatch) {
			jsonString = jsonMatch[1];
		}
		
		// Remove JSON comments (both single-line // and multi-line /* */)
		jsonString = jsonString
			.replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
			.replace(/\/\/.*$/gm, ''); // Remove single-line comments
		
		// Parse and store in locations variable
		const locations = JSON.parse(jsonString);
		
		console.log("Locations data:", JSON.stringify(locations, null, 2));
		console.log("\nFull response object:", JSON.stringify(chatCompletion, null, 2));
	} catch (error) {
		console.error("Error:", error.message);
		if (error.response) {
			console.error("Response status:", error.response.status);
			console.error("Response data:", error.response.data);
		}
		process.exit(1);
	}
}

testChatCompletion();

