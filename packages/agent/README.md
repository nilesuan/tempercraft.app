# @tempercraft/agent

Tempercraft's design agent: its instructions, tools and loop. It's plain TypeScript with no Tauri, Solid or Node imports, so the same code runs inside the desktop app and headless under [promptfoo](https://www.promptfoo.dev).

| Path | What it holds |
| --- | --- |
| `prompts/system.md` | System instructions, sent as the Responses API `instructions` field |
| `src/index.ts` | The contract with the host: `ModelClient`, `Workspace`, `Selection`, `AgentHost` |
| `evals/` | Not yet created: promptfoo tests and red team, added with the agent loop |

**Status:** contract types and a first prompt draft. The loop and tools come next.

The host reads `prompts/system.md` and passes it in as `AgentHost.instructions`: the desktop app with a Vite `?raw` import, the eval harness with `fs.readFile`. That keeps file access out of this package. Design notes and the hardening plan are in [docs/architecture/agent.md](../../docs/architecture/agent.md).
