# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js AI Starter integrating Vercel AI SDK v5 for AI chat functionality with shadcn/ui components. The project uses OpenAI via proxy services (V3 API) for China accessibility.

## Development Commands

```bash
# Development
pnpm dev                    # Start dev server on http://localhost:3000

# Building
pnpm build                  # Production build with Turbopack

# Linting & Type Checking
pnpm lint                   # Run Biome formatter + TypeScript check
pnpm biome check --write --unsafe   # Format code with Biome
pnpm tsc --noEmit --project tsconfig.json  # Type check only

# Production
pnpm start                  # Start production server (requires build)
```

**Package Manager**: This project uses `pnpm` (v9.14.2+). Do not use npm or yarn.

## Architecture

### Tech Stack
- **Framework**: Next.js 16.0.1 (App Router with Turbopack)
- **AI**: Vercel AI SDK v5 (`ai` + `@ai-sdk/react`)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Linting**: Biome v2.3.4
- **Type Checking**: TypeScript 5.9.3

### Project Structure

```
app/
├── api/chat/route.ts       # AI chat API endpoint (streamText)
├── chat/page.tsx           # Chat UI (useChat hook from @ai-sdk/react)
├── page.tsx                # Homepage
├── layout.tsx              # Root layout with Inter font
└── globals.css             # Tailwind v4 theme (@theme directive)

components/ui/              # shadcn/ui components
```

### AI SDK v5 Architecture

**Backend** (`app/api/chat/route.ts`):
- Uses `streamText()` from `ai` package
- Tool definitions with `inputSchema` (Zod schemas)
- Returns `result.toUIMessageStreamResponse()` for frontend compatibility

**Frontend** (`app/chat/page.tsx`):
- Uses `useChat()` from `@ai-sdk/react` (not `ai/react`)
- Returns `{ messages, sendMessage, status }` (no built-in input handlers)
- Messages have `parts` array with typed content:
  - `part.type === 'text'` for text content
  - `part.type === 'tool-{toolName}'` for tool invocations
- Manual input state management with `useState`
- **Must** wrap `useSearchParams()` in `<Suspense>` boundary (Next.js 16 requirement)

### OpenAI Proxy Configuration

The project uses V3 API proxy for China accessibility:
```typescript
const openai = createOpenAI({
  baseURL: serviceUrls[5], // https://cf.v36.cm/v1
});
```

Environment variable required: `OPENAI_API_KEY` in `.env.local`

## Key Implementation Patterns

### Tool Definitions (AI SDK v5)
```typescript
tools: {
  toolName: tool({
    description: "Tool description",
    inputSchema: z.object({ /* Zod schema */ }),
    execute: async (args) => { /* implementation */ }
  })
}
```

**Note**: `inputSchema` replaces deprecated `parameters` field. Tool name is inferred from object key (no explicit `name` field).

### Chat Component Pattern
```typescript
function ChatComponent() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  const isLoading = status === 'submitted' || status === 'streaming';

  // Render messages.parts with switch on part.type
}

export default function Chat() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatComponent />
    </Suspense>
  );
}
```

### Tailwind CSS v4 Constraints

Tailwind v4 uses `@theme` directive for CSS variables:
```css
@theme {
  --background: oklch(1 0 0);
  --foreground: oklch(0.2 0 0);
}
```

**Important**: Cannot use `@apply` with theme variables (e.g., `@apply bg-background` fails). Use direct CSS instead:
```css
body {
  background: var(--background);
  color: var(--foreground);
}
```

## Styling Conventions

- Layout: Max-width of `max-w-md` (centered mobile-first design)
- Typography: Inter font with `font.className` applied to body
- Components: Use shadcn/ui from `components/ui/`
- Class utilities: Use `cn()` from `lib/utils` for conditional classes

## Testing

**Current State**: No test infrastructure exists.

**When adding tests**:
- Use dedicated test directories (`tests/`, `__tests__/`, `spec/`)
- Avoid temporary test scripts in project root
- Run validation scripts directly with bash for quick checks

## Environment Setup

Required file: `.env.local`
```bash
OPENAI_API_KEY="your-openai-api-key"
```

## Common Pitfalls

1. **AI SDK v5 Migration**: Do not use `ai/react` package. Use `@ai-sdk/react` instead.
2. **Tool Schema**: Use `inputSchema` not `parameters` in tool definitions.
3. **Backend Response**: Use `toUIMessageStreamResponse()` not `toTextStreamResponse()`.
4. **useSearchParams**: Always wrap in `<Suspense>` boundary for Next.js 16.
5. **Tailwind v4**: Cannot use `@apply` with theme variables; use CSS variables directly.
6. **Message Rendering**: Access content via `message.parts` array, not `message.content`.

## Deployment

Recommended: Vercel Platform

The project is configured for Vercel deployment with automatic Next.js optimization.
