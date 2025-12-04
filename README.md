# GPT-OSS-120B Translator 🌍

A powerful, modern translation application powered by the GPT-OSS-120B model via Hugging Face router. Translate text between 30+ languages with a beautiful web interface or command-line tool.

## ✨ Features

- 🌐 **30+ Languages**: Support for major world languages
- 🎨 **Modern Web UI**: Beautiful, responsive interface for easy translation
- 💻 **CLI Tool**: Command-line interface for quick translations
- 🔄 **Auto-detect**: Automatically detect source language
- 📊 **Token Tracking**: Automatic tracking of input/output tokens in JSON format
- ⚡ **Fast & Reliable**: Powered by GPT-OSS-120B model
- 🎯 **Accurate Translations**: Preserves meaning, tone, and style

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Hugging Face API token ([Get one here](https://huggingface.co/settings/tokens))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/GPT-OSS-120B-translator.git
cd GPT-OSS-120B-translator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variable:
```bash
export HF_TOKEN=your_huggingface_token_here
```

Or create a `.env` file:
```
HF_TOKEN=your_huggingface_token_here
```

4. Start the web server:
```bash
npm start
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## 📖 Usage

### Web Interface

1. Start the server: `npm start`
2. Open `http://localhost:3000` in your browser
3. Select source and target languages
4. Enter text to translate
5. Click "Translate" or press `Ctrl/Cmd + Enter`

### Command-Line Interface

Run the interactive CLI translator:
```bash
npm run translate
```

Or use it programmatically:
```javascript
import { translate } from './translator.js';

const result = await translate("Hello, how are you?", "English", "Spanish");
console.log(result);
```

### Programmatic Usage

```javascript
import { translate, translateBatch } from './translator.js';

// Single translation
const translated = await translate(
  "Hello, world!",
  "English",
  "Spanish"
);

// Batch translation
const texts = ["Hello", "Thank you", "Please"];
const translations = await translateBatch(texts, "English", "Spanish");
```

## 📁 Project Structure

```
GPT-OSS-120B-translator/
├── public/
│   └── index.html          # Web UI
├── server.js                # Express server
├── translator.js            # Core translation logic
├── translator-example.js    # Usage examples
├── tokens.json              # Token usage tracking
├── package.json             # Dependencies
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables

- `HF_TOKEN`: Your Hugging Face API token (required)
- `PORT`: Server port (default: 3000)

### Supported Languages

English, Spanish, French, German, Italian, Portuguese, Russian, Chinese, Japanese, Korean, Arabic, Hindi, Dutch, Swedish, Norwegian, Danish, Finnish, Polish, Turkish, Greek, Czech, Romanian, Hungarian, Thai, Vietnamese, Indonesian, Malay, Hebrew, Ukrainian, and more.

## 📊 Token Tracking

All translations automatically track input and output tokens in `tokens.json`:

```json
[
  {
    "input": 120,
    "output": 80
  },
  {
    "input": 3208,
    "output": 4172
  }
]
```

## 🛠️ API Endpoints

### POST `/api/translate`

Translate text via API.

**Request:**
```json
{
  "text": "Hello, world!",
  "sourceLang": "English",
  "targetLang": "Spanish"
}
```

**Response:**
```json
{
  "success": true,
  "translatedText": "¡Hola, mundo!",
  "sourceLang": "English",
  "targetLang": "Spanish",
  "usage": {
    "input": 120,
    "output": 80
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Powered by [GPT-OSS-120B](https://huggingface.co/openai/gpt-oss-120b) model
- Hosted via [Hugging Face Router](https://huggingface.co/inference-api)

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ using GPT-OSS-120B
