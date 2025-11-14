import { friendli } from "@friendliai/ai-provider";
import { Agent } from "@mastra/core/agent";

import { searchTool } from "../tools/perplexity-tools";

export const websearchAgent = new Agent({
  name: "websearch-agent",
  instructions: `You are an expert researcher.

Analyze the user's prompt and make up to 10 queries to the provided perplexity-web-search tool
in order to prepare useful information to answer the user's question.

You should produce a small summary of your findings and a few citations.
  `,
  model: friendli("meta-llama-3.3-70b-instruct"),
  tools: [searchTool],
});
