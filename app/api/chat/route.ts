import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

const serviceUrls = [
  "https://api.gpt.ge/v1",
  "https://api.vveai.com/v1",
  "https://api.v3.cm/v1",
  "https://api.v36.cm/v1",
  "https://run.v36.cm/v1",
  "https://cf.v36.cm/v1",
  // Add more service URLs as needed
];

const openai = createOpenAI({
  baseURL: serviceUrls[5],
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
    tools: {
      weather: tool({
        name: "weather",
        description: "Get the weather in a location (farenheit)",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }: { location: string }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFarenheitToCelsius: tool({
        name: "convertFarenheitToCelsius",
        description: "Convert a temperature in farenheit to celsius",
        parameters: z.object({
          temperature: z
            .number()
            .describe("The temperature in farenheit to convert"),
        }),
        execute: async ({ temperature }: { temperature: number }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}
