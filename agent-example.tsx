import { Agent } from "smart-agent-ai";
import type { AgentEvent } from "smart-agent-ai";
import { measure } from "measure-fn";

// Qwen via DashScope (OpenAI-compatible API)
process.env.OPENAI_API_KEY = "sk-sp-5e5bf0b9af3f4be9bd75ff14c7f4c533";
process.env.OPENAI_API_URL = "https://coding-intl.dashscope.aliyuncs.com/v1";

const agent = new Agent({
  model: "qwen3.5-plus",
  maxIterations: 5,
  temperature: 0.3,
  noStreaming: true, // Use structured calls for reliable tool parsing
  objectives: [
    {
      name: "list_files",
      description: "List TypeScript files in the current directory",
      validate: (state) => {
        // Check if any tool was used successfully and output contains .ts files
        const results = state.toolHistory.filter((t) => t.result.success);
        const hasTsFiles = results.some((t) =>
          t.result.output.includes(".ts") || t.result.output.includes(".tsx")
        );
        return {
          met: hasTsFiles,
          reason: hasTsFiles
            ? "Found TypeScript files"
            : "Haven't listed TypeScript files yet",
        };
      },
    },
  ],
});

console.log("🚀 Running smart-agent with Qwen 3.5 Plus...\n");

await measure("Agent run", async () => {
  for await (
    const event of agent.run(
      "List all TypeScript files in the current directory",
    )
  ) {
    switch (event.type) {
      case "iteration_start":
        console.log(`\n── Iteration ${event.iteration} ──`);
        break;
      case "thinking":
        console.log(`💭 ${event.message.substring(0, 200)}`);
        break;
      case "thinking_delta":
        process.stdout.write(event.delta);
        break;
      case "tool_start":
        console.log(`\n🔧 ${event.tool}(${JSON.stringify(event.params)})`);
        break;
      case "tool_result":
        const icon = event.result.success ? "✅" : "❌";
        console.log(`${icon} ${event.result.output.substring(0, 300)}`);
        break;
      case "objective_check":
        for (const r of event.results) {
          console.log(
            `📋 [${r.name}] ${r.met ? "✓ MET" : "✗ NOT MET"} — ${r.reason}`,
          );
        }
        break;
      case "complete":
        console.log(
          `\n🎉 Complete in ${event.iteration} iterations (${event.elapsed}ms)`,
        );
        break;
      case "error":
        console.error(`⚠️ Error: ${event.error}`);
        break;
      case "max_iterations":
        console.log(`⏰ Reached max iterations (${event.iteration})`);
        break;
    }
  }
});
