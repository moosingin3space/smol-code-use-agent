import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import Perplexity from "@perplexity-ai/perplexity_ai";

const client = new Perplexity();

export const searchTool = createTool({
  id: "perplexity-web-search",
  description: "Searches the web with Perplexity",
  inputSchema: z.object({
    query: z
      .union([
        z.string().describe("A single web search query"),
        z.array(z.string()).describe("Multiple web search queries"),
      ])
      .describe("The query/queries to submit to Perplexity"),
  }),
  outputSchema: z.object({
    results: z
      .array(
        z.object({
          pageTitle: z.string().describe("The title of the page"),
          snippet: z.string().describe("The relevant snippet"),
          url: z.string().describe("The URL of the page"),
        }),
      )
      .describe("The results of the Perplexity search query, if successful"),
    success: z.boolean().describe("Whether the request was successful"),
  }),
  execute: async ({ context }) => {
    const { query } = context;

    let results;
    let success = false;
    try {
      const search = await client.search.create({
        query,
        max_results: 10,
      });
      results = search.results.map((result) => ({
        pageTitle: result.title,
        snippet: result.snippet,
        url: result.url,
      }));
      success = true;
    } catch (e) {
      success = false;
    }

    return { results: results!, success };
  },
});

export const groundedAiQueryTool = createTool({
  id: "perplexity-grounded-llm-inference",
  description: "Prompts the Perplexity web-grounded LLM infrastructure",
  inputSchema: z.object({
    prompt: z.string().describe("The prompt to make against Perplexity Sonar"),
  }),
  outputSchema: z.object({
    response: z
      .string()
      .describe(
        "The response from the Perplexity web-grounded LLM infrastructure",
      ),
    success: z.boolean().describe("Whether the request was successful"),
  }),
  execute: async ({ context }) => {
    const { prompt } = context;

    let response;
    let success = false;
    try {
      const completions = await client.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "sonar",
      });

      response = completions.choices[0].message.content.toString();
      success = true;
    } catch (e) {
      response = `Perplexity error: ${e}`;
      success = false;
    }

    return { response, success };
  },
});
