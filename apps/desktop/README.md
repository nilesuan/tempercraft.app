# @tempercraft/desktop

The Tempercraft macOS app: a [Tauri 2](https://tauri.app) shell with a [Solid 2.0](https://docs.solidjs.com) UI.

- `src/`: the UI (Solid 2.0 + TypeScript, built by Vite 8)
- `src-tauri/`: the Rust core. Today it opens the window. The preview server, file access, Keychain and OpenAI calls are planned ([architecture overview](../../docs/architecture/overview.md))

Run it from the repo root with `npm run dev`. See [docs/engineering/developer-guide.md](../../docs/engineering/developer-guide.md) for setup and [docs/engineering/solid-2-standards.md](../../docs/engineering/solid-2-standards.md) before writing UI code: Solid 2.0 differs from both React and Solid 1.x.
