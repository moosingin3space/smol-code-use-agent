import { Mastra } from "@mastra/core/mastra";
import { pyodideAgent } from "./agents/pyodide-agent";
import { websearchAgent } from "./agents/websearch-agent";

export const mastra = new Mastra({
  agents: { pyodideAgent, websearchAgent },
});
