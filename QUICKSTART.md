# Quick Start Guide

## First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
copy .env.example .env    # Windows
cp .env.example .env      # Mac/Linux

# 3. Edit .env and add your OpenAI API key
# Open .env in any text editor and replace:
# OPENAI_API_KEY=your_openai_api_key_here
# with your actual API key from https://platform.openai.com/api-keys
```

## Running the Chatbot

```bash
# Development mode (recommended for learning)
npm run dev

# Production mode (compile first, then run)
npm run build
npm start
```

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Run in development mode |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run the compiled application |
| `npm test` | Run all unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |

## Project Files Overview

| File/Folder | Purpose |
|-------------|---------|
| `src/guards/inputValidator.ts` | Validates user input (empty, length) |
| `src/guards/harmfulFilter.ts` | Blocks harmful keywords |
| `src/guards/outputFilter.ts` | Filters unsafe words from responses |
| `src/services/openaiService.ts` | Handles OpenAI API calls |
| `src/app.ts` | Main application entry point |
| `.env` | Your API keys (don't commit!) |
| `.env.example` | Template for environment variables |
| `package.json` | Project dependencies and scripts |
| `tsconfig.json` | TypeScript compiler configuration |
| `jest.config.js` | Test framework configuration |

## Using the Chatbot

1. Start the chatbot: `npm run dev`
2. Type your message and press Enter
3. Wait for the response
4. Type `exit` or `quit` to stop

## Example Session

```
You: What is TypeScript?
Bot: TypeScript is a strongly typed programming language...

You: How do I install Node.js?
Bot: To install Node.js, visit https://nodejs.org/...

You: exit
👋 Goodbye! Thanks for using Safe Chatbot.
```

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| "Cannot find module" | Run `npm install` |
| "OPENAI_API_KEY not set" | Create `.env` file and add your API key |
| "401 Unauthorized" | Check your API key is correct and has credits |
| Tests failing | Run `npm run build` first |
| TypeScript errors | Check `tsconfig.json` exists |

## Need Help?

- Check the full [README.md](README.md) for detailed instructions
- Review the comments in the source code
- Visit [OpenAI Documentation](https://platform.openai.com/docs)

---

**Ready to start? Run:** `npm run dev`
