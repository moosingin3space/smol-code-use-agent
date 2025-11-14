import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";

import { websearchAgent } from "../agents/websearch-agent";
import { pyodideAgent } from "../agents/pyodide-agent";
import { model } from "../model";

export const answerAgent = new Agent({
  name: "answer-agent",
  instructions: `You are a network of searchers and coders.

The user will ask you a question, and it is your job to provide a fact-grounded
answer. Your answer _must_ be grounded in facts and information from reliable sources
or derived from a computation executable via writing Python code.

You have access to a sophisticated web search engine in Perplexity and an expert Python
programming agent. Use these in combination with each other in order to create a fact-based
answer to the user's query. Note that it is almost always better to incorporate Python code
instead of purely relying on web search.

You should make use of both agents if possible.

Always respond succinctly, with verified facts. If there is any uncertainty, you must clarify
that uncertainty and provide a range of possible answers.
  `,
  model,
  agents: { websearchAgent, pyodideAgent },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:./mastra.db",
    }),
  }),
});
