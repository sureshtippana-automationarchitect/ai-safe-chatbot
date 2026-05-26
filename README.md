# 🤖 AI Safe Chatbot

A beginner-friendly, safe chatbot built with TypeScript and Node.js that demonstrates best practices for building AI applications with multiple layers of safety validation.

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Running Tests](#running-tests)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Learning Resources](#learning-resources)

## ✨ Features

- **Input Validation**: Validates user input for empty strings and maximum length
- **Harmful Content Filter**: Blocks queries containing harmful keywords
- **OpenAI Integration**: Uses OpenAI's Chat Completions API for intelligent responses
- **Output Filtering**: Sanitizes AI responses by filtering unsafe words
- **Modular Architecture**: Clean separation of concerns for maintainability
- **Type Safety**: Full TypeScript support with comprehensive interfaces
- **Comprehensive Testing**: Jest unit tests for all guard functions
- **Beginner-Friendly**: Extensive comments explaining every component

## 📁 Project Structure

```
ai-safe-chatbot/
├── src/
│   ├── guards/                    # Safety validation modules
│   │   ├── inputValidator.ts      # Validates user input
│   │   ├── inputValidator.test.ts # Tests for input validation
│   │   ├── harmfulFilter.ts       # Filters harmful content
│   │   ├── harmfulFilter.test.ts  # Tests for harmful filtering
│   │   ├── outputFilter.ts        # Filters unsafe output
│   │   └── outputFilter.test.ts   # Tests for output filtering
│   ├── services/
│   │   └── openaiService.ts       # OpenAI API integration
│   └── app.ts                     # Main application entry point
├── dist/                          # Compiled JavaScript (generated)
├── coverage/                      # Test coverage reports (generated)
├── node_modules/                  # Dependencies (generated)
├── .env                          # Environment variables (you create this)
├── .env.example                  # Example environment configuration
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest testing configuration
└── README.md                     # This file
```

## 📦 Prerequisites

Before you begin, make sure you have the following installed on your computer:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - To check if installed, run: `node --version`

2. **npm** (comes with Node.js)
   - To check if installed, run: `npm --version`

3. **OpenAI API Key**
   - Sign up at: https://platform.openai.com/
   - Create an API key at: https://platform.openai.com/api-keys
   - Note: You'll need to add billing information to use the API

## 🚀 Installation

Follow these steps to set up the project on your computer:

### Step 1: Open Terminal/Command Prompt

- **Windows**: Press `Win + R`, type `cmd`, and press Enter
- **Mac**: Press `Cmd + Space`, type `terminal`, and press Enter
- **Linux**: Press `Ctrl + Alt + T`

### Step 2: Navigate to the Project Directory

```bash
cd path/to/ai-safe-chatbot
```

Replace `path/to/ai-safe-chatbot` with the actual path where you saved this project.

### Step 3: Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will download and install all the dependencies listed in `package.json`. It may take a few minutes.

## ⚙️ Configuration

### Step 1: Create Environment File

1. Make a copy of `.env.example` and name it `.env`:

**On Windows (Command Prompt):**
```bash
copy .env.example .env
```

**On Mac/Linux (Terminal):**
```bash
cp .env.example .env
```

### Step 2: Add Your OpenAI API Key

1. Open the `.env` file in a text editor (like Notepad, VS Code, or any editor)
2. Replace `your_openai_api_key_here` with your actual OpenAI API key

Your `.env` file should look like this:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-3.5-turbo
MAX_INPUT_LENGTH=500
TEMPERATURE=0.7
```

**Important**: Never share your `.env` file or commit it to version control!

## 🏃 Running the Project

### Option 1: Development Mode (Recommended for Learning)

This runs the TypeScript code directly without compiling:

```bash
npm run dev
```

### Option 2: Production Mode

First, compile the TypeScript code to JavaScript:

```bash
npm run build
```

Then run the compiled code:

```bash
npm start
```

### Using the Chatbot

Once the chatbot starts, you'll see:

```
🤖 Safe Chatbot initialized successfully!
📝 Model: gpt-3.5-turbo
🌡️  Temperature: 0.7

💬 Welcome to Safe Chatbot!
ℹ️  Type your message and press Enter to chat.
ℹ️  Type "exit" or "quit" to stop the chatbot.
──────────────────────────────────────────────────

You: 
```

Now you can type your questions and press Enter. The chatbot will respond!

**To exit the chatbot**, type `exit` or `quit` and press Enter.

### Example Questions to Try

**Safe Questions (Should Work):**
```
What is the difference between let and const?
```
```
How do I install Node.js?
```
```
What is TypeScript?
```
```
Explain how to create a function in JavaScript
```

**Test Harmful Filtering (Should Be Blocked):**
```
I want to steal and hack something
```
```
I hate this situation so much
```
```
How to hack a website?
```

These harmful queries will be blocked with the message:
> 🚫 I cannot process this request as it contains potentially harmful content. Please rephrase your question in a respectful and constructive way.

## 🧪 Running Tests

This project includes comprehensive unit tests for all safety guard functions.

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

This will automatically re-run tests when you make changes:

```bash
npm run test:watch
```

### Generate Coverage Report

To see how much of the code is tested:

```bash
npm run test:coverage
```

The coverage report will be generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` in a browser to see a detailed report.

## 🔍 How It Works

The chatbot uses a **multi-layer safety approach** to ensure safe interactions:

### Flow Diagram

```
User Input
    ↓
1. Input Validation
   - Check if empty
   - Check length limit
    ↓
2. Harmful Content Filter
   - Scan for harmful keywords
   - Block unsafe queries
    ↓
3. OpenAI API Call
   - Send validated input
   - Get AI response
    ↓
4. Output Filter
   - Remove unsafe words
   - Sanitize response
    ↓
Safe Response to User
```

### Detailed Process

#### 1. **Input Validation** (`inputValidator.ts`)

- Checks if input is null, undefined, or empty
- Validates input length (default: 500 characters max)
- Trims whitespace before validation

**Example:**
```typescript
// ✅ Valid
"Hello, how are you?" → Passes
"What is the difference between let and const?" → Passes
"How do I install Node.js?" → Passes

// ❌ Invalid
"" → "Input cannot be empty"
"a".repeat(501) → "Input exceeds maximum length"
```

#### 2. **Harmful Content Detection** (`harmfulFilter.ts`)

- Scans input for harmful keywords (violence, illegal activities, hate speech, etc.)
- Uses word boundary matching to avoid false positives
- Case-insensitive detection

**Example:**
```typescript
// ✅ Safe
"How do I bake a cake?" → Passes
"What is the difference between let and const?" → Passes
"What is TypeScript?" → Passes

// ❌ Harmful
"How to hack a website?" → Blocked
"I want to steal and hack something" → Blocked
"I hate this situation so much" → Blocked
```

#### 3. **OpenAI API Call** (`openaiService.ts`)

- Sends validated input to OpenAI's Chat Completions API
- Includes a system prompt to guide the AI's behavior
- Handles errors gracefully

#### 4. **Output Filtering** (`outputFilter.ts`)

- Scans AI response for unsafe words
- Replaces them with `***`
- Logs filtered words for monitoring

**Example:**
```typescript
// Input: "This is a damn good example"
// Output: "This is a *** good example"
```

## 🏗️ Architecture

### Design Principles

1. **Separation of Concerns**: Each module has a single responsibility
2. **Type Safety**: TypeScript interfaces for all data structures
3. **Testability**: Pure functions that are easy to test
4. **Modularity**: Components can be used independently
5. **Extensibility**: Easy to add new filters or validation rules

### Key Components

#### Guards (`src/guards/`)

**Purpose**: Implement safety checks

- `inputValidator.ts`: Validates user input format and length
- `harmfulFilter.ts`: Detects and blocks harmful content
- `outputFilter.ts`: Sanitizes AI responses

#### Services (`src/services/`)

**Purpose**: External integrations

- `openaiService.ts`: Handles all OpenAI API interactions

#### Main Application (`src/app.ts`)

**Purpose**: Orchestrates all components

- Initializes services
- Manages the chat loop
- Coordinates the safety pipeline

## 🎨 Customization

### Adding Custom Harmful Keywords

In your code, you can add domain-specific harmful keywords:

```typescript
import { addHarmfulKeywords } from './guards/harmfulFilter';

addHarmfulKeywords(['spam', 'phishing', 'scam']);
```

### Adding Custom Unsafe Output Words

```typescript
import { addUnsafeWords } from './guards/outputFilter';

addUnsafeWords(['confidential', 'proprietary']);
```

### Changing Input Length Limit

Modify the `.env` file:

```env
MAX_INPUT_LENGTH=1000
```

### Changing AI Model

Modify the `.env` file to use a different OpenAI model:

```env
OPENAI_MODEL=gpt-4
```

**Note**: GPT-4 is more expensive but more capable than GPT-3.5-turbo.

### Adjusting Temperature

Temperature controls randomness (0.0 to 2.0):

```env
TEMPERATURE=0.3  # More focused and deterministic
TEMPERATURE=1.0  # More creative and varied
```

## 🐛 Troubleshooting

### "OPENAI_API_KEY environment variable is not set"

**Solution**: Make sure you:
1. Created the `.env` file (copied from `.env.example`)
2. Added your actual API key to the `.env` file
3. Saved the `.env` file

### "Error: 401 Unauthorized"

**Causes**:
- Invalid API key
- API key not activated
- Insufficient credits

**Solution**:
1. Verify your API key is correct
2. Check your OpenAI account has credits
3. Generate a new API key if needed

### "Cannot find module"

**Solution**: Run `npm install` again to ensure all dependencies are installed.

### Tests Failing

**Solution**:
1. Make sure you've compiled TypeScript: `npm run build`
2. Clear Jest cache: `npx jest --clearCache`
3. Re-install dependencies: `rm -rf node_modules && npm install`

### TypeScript Errors

**Solution**:
1. Ensure TypeScript is installed: `npm install typescript --save-dev`
2. Check `tsconfig.json` is present
3. Run `npm run build` to see detailed error messages

## 📚 Learning Resources

### TypeScript
- [Official TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

### Node.js
- [Node.js Official Documentation](https://nodejs.org/docs/latest/api/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### OpenAI API
- [OpenAI API Documentation](https://platform.openai.com/docs/introduction)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)

### Testing with Jest
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing TypeScript with Jest](https://jestjs.io/docs/getting-started#using-typescript)

### AI Safety
- [OpenAI Safety Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)
- [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation)

## 🔒 Security Best Practices

1. **Never commit `.env` file**: It contains your API key
2. **Use environment variables**: Don't hardcode sensitive data
3. **Implement rate limiting**: Prevent API abuse (not included in this basic version)
4. **Monitor usage**: Track API costs in your OpenAI dashboard
5. **Use OpenAI's Moderation API**: Consider integrating it for production use

## 🚀 Next Steps

Once you're comfortable with this project, consider:

1. **Adding a web interface**: Use Express.js to create a REST API
2. **Implementing rate limiting**: Prevent abuse of your chatbot
3. **Using OpenAI's Moderation API**: More sophisticated content filtering
4. **Adding conversation history**: Maintain context across messages
5. **Deploying to production**: Host on platforms like Heroku, AWS, or Vercel

## 📝 License

MIT

## 🤝 Contributing

This is a learning project, but feel free to fork and modify it for your own use!

---

**Happy Coding! 🎉**

If you have questions or run into issues, review the [Troubleshooting](#troubleshooting) section or check the comments in the source code.
