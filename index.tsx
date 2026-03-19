import { callLLM } from "jsx-ai";
import { measure } from "measure-fn";

// process.env.GEMINI_API_KEY = "AIzaSyC4F0o_fEUA6UKT495WnObkY_Cdi1jsSPg";
process.env.OPENAI_API_KEY = "sk-sp-5e5bf0b9af3f4be9bd75ff14c7f4c533";
process.env.OPENAI_API_URL = "https://coding-intl.dashscope.aliyuncs.com/v1";

const result = await measure("first", async () => {
  const it = await callLLM(
    <>
      <system>You are a coding agent</system>
      <tool name="exec" description="Run a shell command">
        <param name="command" type="string" required>The command to run</param>
      </tool>
      <message role="user">List all TypeScript files</message>
    </>,
    { model: "qwen3.5-plus" },
  );

  return { text: it.text, toolCalls: it.toolCalls };
});

console.log(JSON.stringify(result, null, 2));
