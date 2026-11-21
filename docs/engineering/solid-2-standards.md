# Engineering standards: Solid 2.0 UI code

| Field | Value |
|---|---|
| Document ID | STD-SOLID-001 |
| Product or service | Tempercraft desktop app: UI code in `apps/desktop/src/` (Solid 2.0) |
| Owner | Project owner |
| Reviewers | None assigned yet (single-maintainer project) |
| Status | Draft |
| Version | 1 |
| Last reviewed | 2026-11-21 |
| Review trigger | When languages, platforms, recurring defects, or team agreements change, and on every Solid update |
| Related work | [ADR-002](../adr/ADR-002-ui-framework-solid-2.md), [developer guide](developer-guide.md), [architecture overview](../architecture/overview.md) |

## Scope and authority

- **Applies to:** all UI code in `apps/desktop/src/`, and to any AI coding tool that writes it.
- **Basis:** researched on 2026-11-21 against `solid-js` 2.0.3.
- **External authority:** two references stay current: Solid's [MIGRATION.md](https://github.com/solidjs/solid/blob/main/documentation/solid-2.0/MIGRATION.md) and the `CHEATSHEET.md` that ships inside `node_modules/solid-js/`. When this document and those disagree, they win.
- **Kinds of statement:** the [standards register](#standards-register) separates required rules from recommendations. [Rule details](#rule-details) and [recommended patterns](#recommended-patterns) are examples.

Why these standards exist:

- **Solid 2.0 is stable.** 2.0.0 was published to npm on 2026-11-17, and 2.0.3 is current. It is a real break from 1.x, with new packages, a new compiler, and new rules for reads, effects, stores, lists and DOM attributes.
- **It fits Tempercraft well.**
  - Streaming a reply updates one text node per chunk.
  - Async is built into the reactive core.
  - The runtime is small: the current UI bundle is 30 KB, 12.6 KB gzipped.
  - Solid's own repo has an AI-chat streaming example that matches our chat.
- **The tooling is ready, and this repo already uses it.** That means `@solidjs/vite-plugin` 3, which has a native Oxc compiler, on Vite 8, plus TypeScript with `jsxImportSource: "@solidjs/web"`. The repo builds, type-checks and renders.
- **Parts of the ecosystem are not ready.** Devtools, most UI kits, TanStack Virtual, lucide-solid and others still support only 1.x. Check every Solid-specific library before adding it, and prefer framework-agnostic ones.
- **AI coding tools default to React and Solid 1.x patterns, which are now bugs.** solid-js ships agent skills and a cheat sheet for this (see [standards consumed by agents](#standards-consumed-by-agents)).

Status of Solid on 2026-11-21:

| | |
| --- | --- |
| `solid-js` | 2.0.3 on npm's `latest` tag. 2.0.0 was published 2026-11-17 after a long beta and release-candidate cycle |
| Solid 1.x | 1.9.20 on the `v1-latest` tag. The 1.x docs moved to v1.solidjs.com |
| Docs | docs.solidjs.com documents 2.0. The 12 design RFCs were frozen at 2.0.0; MIGRATION.md is still maintained |
| SolidStart | Not used here. A Tauri app is a client-only single-page app, so plain Solid + Vite is all we need |

How this repo is set up:

| Package | Version | Role |
| --- | --- | --- |
| `solid-js` | 2.0.3 | Core: signals, memos, effects, stores, control flow. Built on `@solidjs/signals` |
| `@solidjs/web` | 2.0.3 | DOM renderer: `render`, `Portal`, `dynamic`, and the JSX types |
| `@solidjs/vite-plugin` | 3.0.1 | Vite plugin. Uses `@solidjs/compiler` 2.0.2, Solid's native Oxc JSX compiler; Babel is optional |
| `vite` | 8.3.8 | The plugin requires Vite 8 or 9 |
| `typescript` | 6.0.3 | TypeScript 7.0 exists, but the Tauri template and Solid's own examples use 6 |

The three settings that differ from a 1.x project:

```ts
// apps/desktop/vite.config.ts
import solid from "@solidjs/vite-plugin"; // not "vite-plugin-solid", which is the 1.x plugin
```

```jsonc
// apps/desktop/tsconfig.json
"jsx": "preserve",
"jsxImportSource": "@solidjs/web" // was "solid-js"
```

```tsx
// apps/desktop/src/index.tsx
import { render } from "@solidjs/web"; // was "solid-js/web"
```

## Standards register

Every row is a required rule unless it's marked *recommended*. The owner of every rule is the project owner.

| Area | Rule and rationale | Enforcement or review | Exceptions | Owner |
|---|---|---|---|---|
| Packages and imports | Import the renderer from `@solidjs/web` and stores from `solid-js`, and build with `@solidjs/vite-plugin`. The 1.x paths and plugin don't apply to 2.0 | TypeScript (`jsxImportSource`) and review | None | Project owner |
| Reads after writes | Don't expect a read to change right after a write: writes are batched into a microtask. Call `flush()` only in tests and rare imperative code | Review; tests call `flush()` | None | Project owner |
| Effects | Use the two-argument form, `createEffect(compute, apply)`, and `onSettled` instead of `onMount`. The compute function is the dependency list | Review | None | Project owner |
| Writes in reactive scopes | Never write a signal or store from a memo, an effect's compute function or a component body. Write in event handlers, actions or `onSettled` | Dev mode throws (`REACTIVE_WRITE_IN_OWNED_SCOPE`) | None | Project owner |
| Top-level reads | Don't read props or signals at the top of a component body, including by destructuring props. Read them in JSX, a memo or an effect, and don't silence the warning with `untrack` | Dev-mode warning (`STRICT_READ_UNTRACKED`) | None | Project owner |
| Props | Pass values, not accessors, and never destructure props. Use `merge` and `omit` | Review | None | Project owner |
| Async | Use an async `createMemo` with `<Loading>` and `<Errored>`, and actions for mutations. Not `createResource`, `Suspense` or `ErrorBoundary` | Review | None | Project owner |
| Stores | Update stores through draft setters, and use `snapshot` for plain copies. No `createMutable` | Review | None | Project owner |
| Control flow | `For` is keyed by default; use `keyed={false}` instead of `Index`. Don't read accessors at the top of a `For`, `Show` or `Match` callback. Use `dynamic()` instead of `<Dynamic>` | Review | None | Project owner |
| DOM | Lowercase attributes; camelCase event handlers only; a handler expression binds once; refs run unowned, so set up and tear down in `onSettled`; use class arrays and objects instead of hand-built strings | The compiler rejects `on:`, `oncapture:`, `attr:`, `bool:`, `use:` and `classList` on native elements; review | None | Project owner |
| Context | Render the context object itself as the provider; there's no `.Provider` | Review | None | Project owner |
| Solid libraries | Before adding one, `npm view <pkg> peerDependencies` must accept `solid-js` 2. After installing, `npm ls solid-js` must still show one version. A second copy of Solid breaks reactivity | Manual check; in dev, Solid warns "Multiple Solid instances" | None | Project owner |
| Updates | The lockfile pins exact versions. Update Solid on purpose, after reading the changelog | Review of lockfile changes | None | Project owner |
| Untrusted content | Model output and preview messages are untrusted. Render markdown with a parser plus DOMPurify, and check `e.source` and `e.origin` on every message from the preview | Review | None | Project owner |
| App-wide state (*recommended*) | Create state inside a provider component rather than at module scope, so it stays testable and disposable | Review | — | Project owner |
| Long lists (*recommended*) | Start with CSS `content-visibility` before any virtualization; TanStack Virtual supports only 1.x | Review | — | Project owner |

### Rule details

#### Packages and imports

| 1.x | 2.0 |
| --- | --- |
| `solid-js/web` | `@solidjs/web` |
| `solid-js/store` | `solid-js` (stores moved into core) |
| `solid-js/h`, `solid-js/html`, `solid-js/universal` | `@solidjs/h`, `@solidjs/html`, `@solidjs/universal` |
| `JSX` types from `solid-js` | `import type { JSX } from "@solidjs/web"`. For renderer-neutral types, use `Element` from `solid-js` |

#### Reads change only after the batch flushes

All writes are batched into a microtask. After a setter runs, reads still return the old value until the batch flushes, or until you call `flush()`:

```ts
const [count, setCount] = createSignal(0);
setCount(1);
count(); // still 0
flush();
count(); // 1
```

`batch` is gone because batching is now the default. Use `flush()` in tests and in rare imperative code.

#### Effects are split into compute and apply

```ts
// 1.x
createEffect(() => {
  el.title = name();
});

// 2.0: compute tracks; apply does the side effect and may return a cleanup
createEffect(
  () => name(),
  (value) => {
    el.title = value;
    return () => {
      /* cleanup */
    };
  }
);
```

- **No one-argument form.** The `on(...)` helper is unnecessary because the compute function is the dependency list. `{ defer: true }` skips the first run.
- **`onMount` → `onSettled`**, which can return a cleanup. Use it for component setup and teardown, such as listeners and timers.
- **Effects don't compare values.** Apply re-runs whenever compute re-runs. To skip unchanged values, read a memo in compute.
- **Errors:** use `createEffect(compute, { effect, error })`.

#### Two dev-mode guards you will hit

- **Writing inside a reactive scope throws.** You can't write a signal or store from a memo, an effect's compute function or a component body.
  - Write in event handlers, actions or `onSettled` instead, and derive values with `createMemo`.
  - `untrack` doesn't exempt a write.
- **Top-level reactive reads warn (`STRICT_READ_UNTRACKED`).** Reading a prop or signal at the top of a component body reads it once and never updates. That includes destructuring props.
  - Read it in JSX, a memo or an effect instead, and don't silence the warning with `untrack`.
  - To seed local state from a prop, use `createSignal(() => props.initial)`.

#### Props are values; don't destructure them

```tsx
<Counter value={count()} />  // pass the value
<Counter value={count} />    // wrong: the child receives a function

function Counter(props) { return <div>{props.value}</div>; } // reads stay reactive
function Counter({ value }) { /* … */ }                      // wrong: read once, never updates
```

`mergeProps` became `merge` and `splitProps` became `omit`. In `merge`, `undefined` overrides the earlier value; it doesn't mean "skip".

#### Async is part of the reactive core

A memo can return a Promise or an AsyncIterable, and so can `createStore(fn)` and `createProjection`. Reading the value before it resolves suspends to the nearest `<Loading>`:

```tsx
const user = createMemo(() => fetchUser(id()));

<Errored fallback={(err, reset) => <button onClick={reset}>Retry: {String(err())}</button>}>
  <Loading fallback={<Spinner />}>
    <Profile user={user()} />
  </Loading>
</Errored>;
```

| 1.x | 2.0 |
| --- | --- |
| `createResource` | An async `createMemo` plus `<Loading>` |
| `Suspense` / `SuspenseList` | `Loading` / `Reveal` |
| `ErrorBoundary` | `Errored`. `err` is an accessor and `reset` retries the branch |
| `resource.loading` | `<Loading>` for the first load; `isPending(() => x())` for "a change is in flight" |
| `refetch()` | `refresh(x)`, which is silent. Use `affects(x); refresh(x)` to show it as pending |
| `mutate()` / `startTransition` | `action(function* () { … })` with `createOptimistic` / `createOptimisticStore` |

`latest(fn)` peeks at a value that's still in flight. `createDeferred` now means an async memo that may lag behind but never runs ahead.

#### Stores: setters take a draft

```ts
const [state, setState] = createStore({ user: { name: "A" }, list: [] as string[] });

setState((s) => {
  s.user.name = "B"; // mutate the draft; `produce` is now the default behavior
  s.list.push("x");
});
setState((s) => s.list.filter((x) => x !== "x")); // or return a new value (shallow)
```

- **Path setters become draft writes.** 1.x calls like `setStore("user", "name", "B")` are written as mutations of the draft.
- **`unwrap` → `snapshot`**, for when you need a plain copy (JSON, logging, tests).
- **`reconcile(data, "id")`** merges new data into a subtree and keeps object identities.
- **Derived stores:** `createProjection(fn, seed)` is a derived read-only store and `createStore(fn, seed)` is a derived writable one. Together they replace `createSelector`.
- **`deep(store)`** tracks every nested change. You rarely need it.
- **`createMutable` is gone.** Use draft setters.

#### Control flow

```tsx
// Keyed (default): raw item, index accessor
<For each={items()}>{(item, i) => <Row item={item} index={i()} />}</For>
// Replaces <Index>: item accessor, plain index
<For each={items()} keyed={false}>{(item, i) => <Row item={item()} index={i} />}</For>
// Count-based, no diffing
<Repeat count={n()}>{(i) => <Skeleton index={i} />}</Repeat>
// Function children get an accessor
<Show when={user()} fallback={<Login />}>{(u) => <Profile user={u()} />}</Show>
```

- **Callback bodies don't track.** The body of a `For`, `Show` or `Match` callback is not a tracking scope. Read accessors in JSX or a memo, not in a `const` at the top of the callback.
- **`<Dynamic component={…}>` is deprecated.** Hoist `const Active = dynamic(() => …)` (from `@solidjs/web`) and render `<Active />`.

#### DOM

- **Attributes:** they're plain attributes, written lowercase (`tabindex`, not `tabIndex`).
  - Boolean attributes are present or absent: `muted={false}` removes the attribute.
  - `class` takes strings, objects and arrays: `class={["card", { active: isActive() }]}`. Don't build class strings by hand.
- **Events:** handlers are camelCase only (`onClick`). A lowercase `onclick` is now just an HTML attribute.
  - On native elements, `on:`, `oncapture:`, `attr:`, `bool:`, `use:` and `classList` are compile errors.
  - A handler expression binds once: `onClick={cond() ? a : b}` never re-evaluates. Make the decision inside the handler.
- **Refs:** they're callbacks or `let` variables, and they run unowned. Don't call `onCleanup` inside one; do setup and teardown in `onSettled`. A ref also runs before the element is attached to the document.
- **Directives:** they become ref factories: `ref={tooltip({ content: "Save" })}`, or several at once with `ref={[autofocus, tooltip(…)]}`. For native listener options, use a ref: `ref={(el) => el.addEventListener("click", fn, { capture: true })}`.
- **Form inputs:** `value={x()}` writes the DOM property every time the binding runs. Use a draft signal updated from `onInput`, or an uncontrolled input with `defaultValue`.

#### The context object is the provider

```tsx
const Session = createContext<SessionApi>(); // no default: useContext returns SessionApi, or throws
<Session value={createSession()}><Shell /></Session>; // was <Session.Provider value={…}>
const session = useContext(Session);
```

You no longer need a `useX()` wrapper that throws when the provider is missing. For an optional context, use `createContext<T | null>(null)`.

#### Other renames and removals

| 1.x | 2.0 |
| --- | --- |
| `onMount` | `onSettled` |
| `equalFn` | `isEqual` |
| `getListener` | `getObserver` |
| `indexArray` | `mapArray` with `keyed: false` |
| `from(source)` | Returns an async iterable now; use it as `createMemo(() => from(source))` |
| `observable()` | An effect that pushes values out |
| `createComputed` | `createMemo`, a split effect, or `createSignal(fn)` |
| `catchError` / `onError` | `Errored`, or the effect `error` option |
| `resetErrorBoundaries` | Gone: boundaries heal on their own |

`createRoot` inside another owner is now disposed together with that owner. To detach it, use `runWithOwner(null, …)`.

### Recommended patterns

#### Streaming a chat reply

Solid's repo has an AI-chat example, [examples/chat-client](https://github.com/solidjs/solid/tree/main/examples/chat-client), that maps directly onto our chat:
- Each streamed chunk is one store write, and only the last text binding updates.
- Stop and "ask again" both work by superseding the read.
- Nothing is an effect.

Below is that pattern adapted to our agent. It's a sketch, because the agent's event stream doesn't exist yet:

```tsx
const [turns, setTurns] = createStore<Turn[]>([]);
const [asked, setAsked] = createSignal<string>();

// The reply being written. Writing `asked` starts, replaces or stops it:
// a new value re-runs this, and Solid closes the previous run's iterator.
const reply = createProjection(
  (draft: Reply) => {
    const question = asked();
    draft.blocks = [];
    draft.done = false;
    if (question === undefined) return;
    const history = untrack(() => snapshot(turns)); // read once, when asked
    return write(draft, [...history, { role: "user", text: question }]);
  },
  { blocks: [], done: false }
);

async function* write(draft: Reply, history: Turn[]) {
  for await (const event of agent.run(history)) {
    if (event.type === "text") {
      appendDelta(draft.blocks, event.delta); // one write, to the last block
      yield; // lands it
    }
  }
  draft.done = true;
}

function stop() {
  keepPartialReply(); // moves what arrived into `turns`
  setAsked(undefined);
}
```

How to render it:
- **Boundaries:** put the reply inside `<Errored>`, whose Retry re-reads the projection and so asks again. Inside that, use `<Loading>` to show "Thinking…" until the first chunk lands.
- **Keying:** wrap it in `<Show when={asked()} keyed>` so each new question gets fresh boundaries.
- **Markdown:** render it per block, as the example does, so a new chunk never re-parses the whole message.

#### Tauri events and channels

Start listeners in `onSettled`. Writing to a signal from the callback is fine, because the callback runs outside any reactive scope:

```tsx
onSettled(() => {
  const off = listen<string>("workspace://changed", (e) => setChangedPath(e.payload));
  return () => void off.then((unlisten) => unlisten());
});
```

Some sources should be a reactive value that holds only the latest state. For those, `createMemo(() => from(subscribe))` takes a `(next, error, complete) => unsubscribe` function. It suspends until the first value arrives, so put it under a `<Loading>`, or use it only with sources that emit as soon as you subscribe.

#### The preview iframe and the picker

```tsx
function Preview(props: { src: string; onPick: (selection: Selection) => void }) {
  let frame!: HTMLIFrameElement;
  onSettled(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.contentWindow) return; // only messages from our preview
      if (e.data?.type === "pick:selected") props.onPick(e.data.selection);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  });
  return <iframe ref={frame} src={props.src} title="Preview" />;
}
```

The page inside the iframe is generated code, so check the sender of every message: `e.source`, and `e.origin` against the preview server's origin.

#### App-wide state

Create state inside a provider component, such as `<Session value={createSession()}>`, rather than at module scope. A client-only app can get away with module-scope stores, but providers keep state testable and disposable.

#### Long conversations

Don't reach for a virtualization library; TanStack Virtual supports only 1.x.
- **Start with CSS.** Put `content-visibility: auto; contain-intrinsic-size: auto 200px;` on each turn, and WebKit skips rendering turns that are off screen. This works in Safari 18 and later; older systems ignore it.
- **Real virtualization, if ever needed:** `<Repeat>` is the 2.0 primitive for count-based windowing.

## Quality and maintainability

### Testing and diagnostics

- **Unit tests:** use Vitest with jsdom and `@solidjs/testing-library@next`.
  - Call `flush()` before asserting on signals.
  - Wrap bare primitives in `createRoot((dispose) => { …; dispose(); })`.
- **Diagnostics:** dev builds report structured codes such as `STRICT_READ_UNTRACKED` and `REACTIVE_WRITE_IN_OWNED_SCOPE`.
  - The full list, with fixes, is in `node_modules/solid-js/diagnostics.json`, and each code has a page under docs.solidjs.com/reference/solid-js/diagnostics/.
  - `@solidjs/diagnostics` captures them in tests, so a reactivity warning can fail the build.
- **Devtools:** `solid-devtools` doesn't support 2.0 yet. Use the diagnostics and the WebKit inspector instead (right-click → Inspect Element in `npm run dev`).

### Ecosystem readiness (npm, 2026-11-21)

"Ready" means the latest release declares `solid-js: ^2`.

| Package | Status | Notes |
| --- | --- | --- |
| `@solidjs/vite-plugin` | Ready | 3.0.1; needs Vite 8 or 9 |
| `@solidjs/router` | Ready | 2.0.1. We don't need a router yet |
| `@solidjs/meta` | Ready | 2.0.0 |
| `@solidjs/diagnostics` | Ready | 2.0.3. Captures dev diagnostics for tests and agents |
| `@solid-primitives/*` | Check each | For example, `scheduled` 2.0.0 and `resize-observer` 4.0.0 are ready |
| `@solidjs/testing-library` | Pre-release | 1.0.0-rc.2 on the `next` tag; 0.8.x is 1.x-only |
| `@tanstack/solid-query` | Pre-release | 6.0.0-rc.6 on `rc`; 5.x is 1.x-only |
| `@kobalte/core` | Pre-release | 2.0.0-alpha.5 on `alpha`; 0.13.x is 1.x-only |
| `@ark-ui/solid` | Unclear | 5.40.0 declares `solid-js >=1.6`, which is probably untested on 2.0. 6.0.0-next.0 exists |
| `solid-devtools` | 1.x only | 0.34.5 |
| `corvu` | 1.x only | 0.7.2 |
| `@tanstack/solid-virtual` | 1.x only | 3.13.53 |
| `lucide-solid` | 1.x only | 1.77.0. Use SVG files or a framework-agnostic icon set |
| `solid-markdown` | 1.x only | 2.1.1. Use a framework-agnostic parser plus a sanitizer |
| `vite-plugin-solid` | 1.x only | 2.11.x, replaced by `@solidjs/vite-plugin` |

Framework-agnostic libraries cover most of what Tempercraft needs:
- the Tauri JS API
- the Firebase JS SDK
- a markdown parser plus DOMPurify, since model output is untrusted
- Shiki for code highlighting

## Review and evidence

Checked on 2026-11-21:
- `npm ls` shows one copy of each Solid package.
- `npm run typecheck` passes.
- `vite build` succeeds.
- The full `tauri build` pipeline compiles.
- The UI renders with no console errors or Solid dev warnings.

No linter checks these rules yet. Review UI changes against the [standards register](#standards-register) and the bundled cheat sheet. A passing type check and a clean dev console show only what TypeScript and Solid's diagnostics check, not that every rule is followed.

## Adoption and exceptions

| Exception | Reason and risk | Compensating approach | Decision owner | Expiry or review |
|---|---|---|---|---|
| None | — | — | Project owner | At the next Solid update |

The only UI code today is the Tauri template converted to Solid 2.0, and it passed the checks above. New code follows the register from the start.

## Evolution

When Solid updates, reread MIGRATION.md and the bundled `CHEATSHEET.md`, update this document, and keep it in line with the agent skills. Risks and how we handle them:

| Risk | How we handle it |
| --- | --- |
| A brand-new release, with patches landing fast (2.0.0 to 2.0.3 within days) | The lockfile pins exact versions. Update on purpose, after reading the changelog |
| Libraries we want are 1.x-only | Keep Solid-specific dependencies few, prefer framework-agnostic libraries, and write small components ourselves |
| No devtools | Dev diagnostics, `@solidjs/diagnostics` in tests, the WebKit inspector |
| AI tools write 1.x or React code | Link the bundled skills; review against the cheat sheet |
| Behavior still being refined: the cheat sheet notes a deferred change to how a re-armed `Loading` boundary behaves | Don't rely on `Loading` edge cases; reread MIGRATION.md when updating |

## Standards consumed by agents

Most model training data is React or Solid 1.x, and both now produce bugs here. solid-js 2.0 ships help for this inside the package:

- **`node_modules/solid-js/CHEATSHEET.md`:** the full API, ending with a "what changed from 1.x" list written for code generators.
- **`node_modules/solid-js/skills/`:** three agent skills in the `SKILL.md` format:
  - `solid-2.0`: a primer with three rules and the 1.x corrections
  - `solid-2.0-cheatsheet`
  - `reactivity-diagnostics`: maps each diagnostic code to its fix

To have Claude Code load them in this repo, link them into `.claude/skills/`. The links resolve once `npm install` has run:

```sh
mkdir -p .claude/skills
for s in solid-2.0 solid-2.0-cheatsheet reactivity-diagnostics; do
  ln -s "../../node_modules/solid-js/skills/$s" ".claude/skills/$s"
done
```

Status (2026-11-21): not set up yet, because `.claude/skills/` doesn't exist. The skills are advisory. The checks that actually run are TypeScript, the compiler and Solid's dev diagnostics.

The mistakes generated code makes most often:
- destructuring props, or passing accessors as props
- a one-argument `createEffect`
- path-style store setters
- expecting a read to change right after a write
- writing signals inside memos or component bodies
- reading `For`/`Show` accessors at the top of the callback

## Sources

- [Solid 2.0 migration guide (MIGRATION.md)](https://github.com/solidjs/solid/blob/main/documentation/solid-2.0/MIGRATION.md)
- [Solid 2.0 RFC index](https://github.com/solidjs/solid/tree/main/documentation/solid-2.0)
- [Solid 2.0 cheat sheet](https://github.com/solidjs/solid/blob/main/packages/solid/CHEATSHEET.md) (also in `node_modules/solid-js/CHEATSHEET.md`)
- [examples/chat-client](https://github.com/solidjs/solid/tree/main/examples/chat-client) and [examples/todos](https://github.com/solidjs/solid/tree/main/examples/todos)
- [docs.solidjs.com](https://docs.solidjs.com)
- npm registry: versions, dist-tags and peer dependencies, queried 2026-11-21

## Completion check

- [x] Rules have clear scope, rationale, and enforcement.
- [x] Standards link to review and quality evidence without overstating tooling.
- [x] Adoption, exceptions, and changes have owners and review triggers.
