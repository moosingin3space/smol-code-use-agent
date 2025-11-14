import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { loadPyodide } from "pyodide";

export const runPyodideTool = createTool({
  id: "run-pyodide",
  description: "Runs Python code in a Pyodide sandbox",
  inputSchema: z.object({
    code: z.string().describe("Python code to run"),
  }),
  outputSchema: z.object({
    result: z
      .string()
      .describe(
        `The result of the Python code, including a main() function that we can invoke.`,
      ),
    success: z
      .boolean()
      .describe("Whether the Python code executed successfully"),
  }),
  execute: async ({ context }) => {
    const { code } = context;

    let pyodide = await loadPyodide();
    let result;
    let success = false;
    try {
      const codeLines = [code, "main()"];
      result = await pyodide.runPythonAsync(codeLines.join("\n"));
      success = true;
    } catch (e) {
      result = `Failed to run Python code: ${e}`;
      success = false;
    }

    return { result, success };
  },
});
