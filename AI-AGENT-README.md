# LinkForge AI Agent

An intelligent AI assistant that helps users with LinkForge features. The agent can answer questions about the platform, guide users through tasks, and execute allowed actions.

## Features

- **Knowledge Base RAG**: Retrieves relevant documentation to answer questions accurately
- **Streaming Responses**: Real-time response streaming for fast user experience
- **Tool Execution**: Can perform actions like creating links, viewing analytics, navigating pages
- **Rate Limiting**: Protects against abuse (30 requests/minute)
- **FAQ Caching**: Caches common questions for instant responses
- **Feedback System**: Users can rate responses (thumbs up/down)
- **Scope Enforcement**: Only answers LinkForge-related questions

## Setup

### 1. Environment Variables

Add to your `.env` file:

```env
# Required: Anthropic API Key
ANTHROPIC_API_KEY="your-api-key-here"
```

Get your API key from: https://console.anthropic.com/

### 2. Database Migration

The AI agent requires additional database tables. Push the schema:

```bash
npm run db:push
```

### 3. Ingest Knowledge Base

Index the documentation for RAG retrieval:

```bash
# First time or incremental update
npm run kb:ingest

# Full rebuild (clears existing data)
npm run kb:rebuild
```

### 4. Start Development Server

```bash
npm run dev
```

The chat widget will appear as a floating button in the bottom-right corner.

## Architecture

### Components

```
src/
├── lib/ai/
│   ├── config.ts         # AI configuration (model, prompts, limits)
│   ├── kb-ingest.ts      # Knowledge base ingestion pipeline
│   ├── retrieval.ts      # RAG retrieval logic
│   └── tools.ts          # Tool definitions and executors
├── app/api/ai/
│   ├── chat/route.ts     # Streaming chat endpoint
│   └── feedback/route.ts # Feedback collection endpoint
└── components/ai/
    └── chat-widget.tsx   # Frontend chat UI
```

### Knowledge Base Structure

```
ai-kb/
├── features/           # Feature documentation
│   ├── link-shortener.md
│   ├── qr-codes.md
│   ├── analytics.md
│   ├── utm-builder.md
│   └── bio-pages.md
├── guides/             # How-to guides
│   └── getting-started.md
└── faqs/               # Frequently asked questions
    └── general.md
```

### Database Models

- `KBDocument`: Stores chunked documentation for retrieval
- `AIChatSession`: Chat session tracking
- `AIChatMessage`: Individual messages with metadata
- `AIToolLog`: Audit log for tool executions
- `AIFaqCache`: Cached Q&A pairs for fast responses

## API Endpoints

### POST /api/ai/chat

Streaming chat endpoint.

**Request:**
```json
{
  "message": "How do I create a short link?",
  "sessionId": "optional-session-id",
  "userId": "optional-user-id"
}
```

**Response:** Server-Sent Events (SSE) stream

```
data: {"type": "text", "content": "To create..."}
data: {"type": "tool_result", "tool": "navigate_to_page", "result": {...}}
data: {"type": "done", "sessionId": "...", "sources": [...], "latencyMs": 1234}
```

### POST /api/ai/feedback

Submit feedback for a message.

**Request:**
```json
{
  "messageId": "message-id",
  "rating": 5,
  "text": "Optional feedback text"
}
```

## Available Tools

| Tool | Description | Auth Required |
|------|-------------|---------------|
| `create_support_ticket` | Create support ticket | No |
| `create_link` | Create a new short link | Yes |
| `get_link_analytics` | Get analytics data | Yes |
| `generate_qr_code` | Open QR code generator | No |
| `navigate_to_page` | Navigate to app page | No |
| `get_account_info` | Get account/plan info | Yes |

## Adding New Documentation

1. Create a markdown file in `ai-kb/features/`, `ai-kb/guides/`, or `ai-kb/faqs/`
2. Use clear headings (H1 for title, H2/H3 for sections)
3. Include step-by-step instructions where applicable
4. Run `npm run kb:ingest` to index the new content

Example:

```markdown
# New Feature Name

## Overview
Brief description of the feature.

## How to Use
1. Step one
2. Step two
3. Step three

## FAQ
Common questions about this feature.
```

## Adding New Tools

1. Add schema in `src/lib/ai/tools.ts`:

```typescript
export const toolSchemas = {
  // ... existing tools
  my_new_tool: z.object({
    param1: z.string(),
    param2: z.number().optional(),
  }),
};
```

2. Add tool definition:

```typescript
export const toolDefinitions: ToolDefinition[] = [
  // ... existing definitions
  {
    name: "my_new_tool",
    description: "What this tool does",
    parameters: toolSchemas.my_new_tool,
    requiresAuth: true,
    requiresConfirmation: false,
    rateLimit: 10,
  },
];
```

3. Add executor function:

```typescript
async function executeMyNewTool(params: z.infer<typeof toolSchemas.my_new_tool>): Promise<ToolResult> {
  // Implementation
  return {
    success: true,
    message: "Action completed!",
    data: { /* result data */ },
  };
}
```

4. Add case in `executeTool` switch statement.

## Security

- **Scope Enforcement**: Agent only answers LinkForge-related questions
- **Prompt Injection Protection**: Filters known injection patterns
- **Rate Limiting**: 30 requests/minute per IP
- **Input Validation**: All tool inputs validated with Zod
- **Audit Logging**: All tool executions logged
- **No Secret Exposure**: API keys never sent to client

## Performance

- **Streaming**: Responses stream in real-time
- **Caching**: Common questions cached for instant response
- **Model**: Uses Claude Sonnet for speed/quality balance
- **Retrieval**: Keyword-based retrieval (upgrade to embeddings for production)

## Customization

### Change AI Model

Edit `src/lib/ai/config.ts`:

```typescript
export const AI_CONFIG = {
  model: "claude-sonnet-4-20250514", // Change model here
  // ...
};
```

### Modify System Prompt

Edit `systemPrompt` in `src/lib/ai/config.ts` to change the agent's behavior.

### Adjust Rate Limits

```typescript
export const AI_CONFIG = {
  rateLimitPerMinute: 30,  // Requests per minute
  rateLimitPerHour: 200,   // Requests per hour
  // ...
};
```

## Troubleshooting

### "AI service not configured"
- Check that `ANTHROPIC_API_KEY` is set in `.env`

### Empty responses
- Run `npm run kb:ingest` to index documentation
- Check database connection

### Rate limit errors
- Wait 1 minute before retrying
- Check if IP is being shared (VPN, proxy)

## TODO

- [ ] Implement vector embeddings for better retrieval
- [ ] Add conversation memory across sessions
- [ ] Implement more tools (delete link, update profile, etc.)
- [ ] Add admin dashboard for analytics
- [ ] Implement A/B testing for responses
