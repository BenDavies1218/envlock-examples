# Move `findFreePort` to `envlock-core` Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move `findFreePort` from `packages/next` into `envlock-core` as a shared export, then update `packages/next` to import it from there.

**Architecture:** `packages/core/src/find-port.ts` gets the implementation; `packages/core/src/index.ts` exports it. `packages/next/src/cli/find-port.ts` and its test are deleted; `packages/next/src/cli/index.ts` updates its import. The port-switching logic in `runNextCommand` is unchanged.

**Tech Stack:** TypeScript, tsup (core bundles via `src/index.ts` entry — no tsup changes needed), vitest

**Worktree:** `/Users/benjamindavies/Documents/GitHub/envlock/.worktrees/envlock-next-v0.6.0` (branch `feat/envlock-next-v0.6.0`) — run this plan after all v0.6.0 tasks are complete.

---

### Task 1: Add `findFreePort` to `packages/core`

**Files:**
- Create: `packages/core/src/find-port.ts`
- Create: `packages/core/src/find-port.test.ts`
- Modify: `packages/core/src/index.ts`

**Step 1: Write the failing tests**

Create `packages/core/src/find-port.test.ts`:

```ts
import { createServer } from "node:net";
import { describe, expect, it } from "vitest";
import { findFreePort } from "./find-port.js";

function occupyPort(port: number): Promise<() => Promise<void>> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(port, "127.0.0.1", () => {
      resolve(() => new Promise((res) => server.close(() => res())));
    });
    server.on("error", reject);
  });
}

describe("findFreePort", () => {
  it("returns the preferred port when it is free", async () => {
    const port = await findFreePort(19001);
    expect(port).toBe(19001);
  });

  it("returns the next free port when preferred is occupied", async () => {
    const release = await occupyPort(19002);
    try {
      const port = await findFreePort(19002);
      expect(port).toBe(19003);
    } finally {
      await release();
    }
  });

  it("skips multiple occupied ports to find a free one", async () => {
    const release1 = await occupyPort(19010);
    const release2 = await occupyPort(19011);
    try {
      const port = await findFreePort(19010);
      expect(port).toBe(19012);
    } finally {
      await release1();
      await release2();
    }
  });

  it("throws if no free port found within range of 10", async () => {
    const releases: Array<() => Promise<void>> = [];
    for (let p = 19020; p <= 19030; p++) {
      releases.push(await occupyPort(p));
    }
    try {
      await expect(findFreePort(19020)).rejects.toThrow(/no free port/i);
    } finally {
      await Promise.all(releases.map((r) => r()));
    }
  });
});
```

**Step 2: Run tests to confirm they fail**

```bash
cd /Users/benjamindavies/Documents/GitHub/envlock/.worktrees/envlock-next-v0.6.0/packages/core
pnpm test -- find-port --reporter=verbose
```

Expected: 1 error — `find-port.js` module not found.

**Step 3: Implement `find-port.ts`**

Create `packages/core/src/find-port.ts`:

```ts
import { createServer } from "node:net";

function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => server.close(() => resolve(true)));
    server.listen(port, "127.0.0.1");
  });
}

export async function findFreePort(preferred: number): Promise<number> {
  for (let port = preferred; port <= preferred + 10; port++) {
    if (await isPortFree(port)) return port;
  }
  throw new Error(
    `[envlock] No free port found in range ${preferred}–${preferred + 10}.`,
  );
}
```

**Step 4: Export from `packages/core/src/index.ts`**

Add this line to `packages/core/src/index.ts`:

```ts
export { findFreePort } from "./find-port.js";
```

**Step 5: Run tests to confirm they pass**

```bash
pnpm test -- find-port --reporter=verbose
```

Expected: 4 PASSes.

**Step 6: Run the full core test suite**

```bash
pnpm test
```

Expected: All tests pass.

**Step 7: Commit**

```bash
cd /Users/benjamindavies/Documents/GitHub/envlock/.worktrees/envlock-next-v0.6.0
git add packages/core/src/find-port.ts packages/core/src/find-port.test.ts packages/core/src/index.ts
git commit -m "feat(core): add findFreePort utility"
```

---

### Task 2: Update `packages/next` to import `findFreePort` from `envlock-core`

**Files:**
- Delete: `packages/next/src/cli/find-port.ts`
- Delete: `packages/next/src/cli/find-port.test.ts`
- Modify: `packages/next/src/cli/index.ts`
- Modify: `packages/next/src/cli/index.test.ts`

**Step 1: Delete the local find-port files**

```bash
rm packages/next/src/cli/find-port.ts
rm packages/next/src/cli/find-port.test.ts
```

**Step 2: Update the import in `packages/next/src/cli/index.ts`**

Change:

```ts
import { findFreePort } from "./find-port.js";
```

to:

```ts
import { findFreePort } from "envlock-core";
```

**Step 3: Update the mock in `packages/next/src/cli/index.test.ts`**

The existing `vi.mock("envlock-core", ...)` block already mocks `envlock-core`. Add `findFreePort` to it.

Change:

```ts
vi.mock("envlock-core", () => ({
  ENVIRONMENTS: { development: "development", staging: "staging", production: "production" },
  runWithSecrets: vi.fn(),
  validateEnvFilePath: vi.fn(),
  validateOnePasswordEnvId: vi.fn(),
  log: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  setVerbose: vi.fn(),
}));
```

to:

```ts
vi.mock("envlock-core", () => ({
  ENVIRONMENTS: { development: "development", staging: "staging", production: "production" },
  runWithSecrets: vi.fn(),
  validateEnvFilePath: vi.fn(),
  validateOnePasswordEnvId: vi.fn(),
  log: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  setVerbose: vi.fn(),
  findFreePort: vi.fn(),
}));
```

Then add the import alongside the other destructured imports (find the line that imports from `"envlock-core"` and add `findFreePort`):

```ts
const { runWithSecrets, validateOnePasswordEnvId, findFreePort } = await import("envlock-core");
```

And in `beforeEach`, add the default mock return:

```ts
vi.mocked(findFreePort).mockResolvedValue(3000);
```

**Step 4: Run the next test suite to confirm all tests pass**

```bash
cd /Users/benjamindavies/Documents/GitHub/envlock/.worktrees/envlock-next-v0.6.0/packages/next
pnpm test
```

Expected: All tests pass. No references to `find-port.js`.

**Step 5: Build both packages to confirm no type errors**

```bash
cd /Users/benjamindavies/Documents/GitHub/envlock/.worktrees/envlock-next-v0.6.0/packages/core && pnpm build
cd /Users/benjamindavies/Documents/GitHub/envlock/.worktrees/envlock-next-v0.6.0/packages/next && pnpm build
```

Expected: Both build cleanly, no errors.

**Step 6: Commit**

```bash
cd /Users/benjamindavies/Documents/GitHub/envlock/.worktrees/envlock-next-v0.6.0
git add packages/next/src/cli/index.ts packages/next/src/cli/index.test.ts
git rm packages/next/src/cli/find-port.ts packages/next/src/cli/find-port.test.ts
git commit -m "refactor(next): import findFreePort from envlock-core"
```
