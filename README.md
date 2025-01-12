# Next.js AI Starter ![Next JS](https://img.shields.io/badge/Next-black?style=flat&logo=next.js&logoColor=white)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

- It integrates the [Vercel AI SDK](https://sdk.vercel.ai) for seamless AI functionality and leverages [shadcn/ui](https://ui.shadcn.com) for a modern, customizable user interface.
- To ensure smooth OpenAI API access in China, the project utilizes the [V3 API](https://api.v3.cm/register?aff=z8qw) as a reliable proxy solution.

## Getting Started

### 1. Set Up Environment Variables

Create a `.env.local` file in the root of your project and add your OpenAI API key:

```bash
OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
```

Replace `YOUR_OPENAI_API_KEY` with your actual OpenAI API key to enable AI functionality.

### 2. Run the Development Server

Start the development server with the following command:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

### 3. Customize Your Project

- Homepage: Edit `app/page.tsx` to customize the homepage.
- Chat Interface: Modify `app/chat/page.tsx` to build the chat interface.
- AI Logic: Update `app/api/chat/route.ts` to implement AI-powered chat interactions using the Vercel AI SDK.

### 4. Customize UI Components

You can further tailor the design by modifying shadcn/ui components in the `components/ui` folder. This allows you to create a fully customized user interface.

### 5. Optimized Typography

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Inter](https://rsms.me/inter/), ensuring a modern and performant typography experience.

## Learn More

To learn more about Next.js AI starter, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs/introduction) - explore how to integrate AI functionality using the Vercel AI SDK.
- [shadcn/ui Documentation](https://ui.shadcn.com/docs) - learn how to use and customize components from shadcn/ui.

Follow [Frad (@FradSer) on X](https://x.com/FradSer) for updates and insights. Your feedback and contributions are welcome! Feel free to send a DM as well.

## Recommended Deployment on Vercel

The easiest way to deploy this project is to use [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js. Vercel provides seamless integration with Next.js, offering fast builds, automatic scaling, and a global CDN for optimal performance.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
