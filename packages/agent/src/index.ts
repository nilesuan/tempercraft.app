/**
 * @tempercraft/agent: the design agent, independent of where it runs.
 *
 * The desktop app and the promptfoo evals run this same code. They differ only in
 * what they pass in (the types below), so nothing in this package may import Tauri,
 * Solid or Node APIs. See docs/architecture/agent.md.
 *
 * First draft: these types will change once the agent loop is written.
 */

/** One OpenAI Responses API request. The client always sends `store: false` and `stream: true`. */
export interface ModelRequest {
  body: Record<string, unknown>;
  signal?: AbortSignal;
}

/** One server-sent event from the Responses stream, e.g. `response.output_text.delta`. */
export interface ModelEvent {
  type: string;
  [field: string]: unknown;
}

/**
 * Sends a request and yields its stream events.
 * - Desktop: forwarded to Rust, which adds the user's ChatGPT token from the Keychain.
 * - Evals: a direct `fetch` with the developer's own OpenAI API key.
 */
export type ModelClient = (request: ModelRequest) => AsyncIterable<ModelEvent>;

/** The user's project folder. Paths are relative to it; the desktop app enforces that in Rust. */
export interface Workspace {
  list(): Promise<string[]>;
  read(path: string): Promise<string>;
  write(path: string, contents: string): Promise<void>;
}

/** What the preview's element picker reports when the user points at an element. */
export interface Selection {
  /** File the element came from, relative to the workspace. */
  file: string;
  /** 1-based source line, when the preview server could map it. */
  line?: number;
  selector: string;
  outerHTML: string;
  /** A few computed styles: color, font size, spacing and so on. */
  styles: Record<string, string>;
  rect: { x: number; y: number; width: number; height: number };
}

/** What a host (the desktop app or the eval harness) provides to an agent run. */
export interface AgentHost {
  /** Contents of prompts/system.md, sent as the Responses API `instructions` field. */
  instructions: string;
  model: ModelClient;
  workspace: Workspace;
}
