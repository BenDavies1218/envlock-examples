# envlock Showcase Site & Examples Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a static Vite + React showcase site at `apps/website/` and fully runnable minimal example projects at `examples/<lang>/` for 9 languages.

**Architecture:** Single-page Vite + React app with 5 anchor-linked sections (Hero, How It Works, Language Showcase, Examples Grid, Install CTA). Language data is centralised in one file. Each `examples/<lang>/` is a self-contained project with its own README.

**Tech Stack:** Vite 6, React 19, Tailwind CSS 4, `react-syntax-highlighter` for code blocks, plain CSS variables for theming.

---

## Task 1: Scaffold `apps/website/`

**Files:**
- Create: `apps/website/` (scaffold via Vite)
- Modify: `apps/website/package.json`
- Modify: `apps/website/index.html`

**Step 1: Scaffold the Vite + React project**

```bash
cd /path/to/dotenvx-example
npm create vite@latest apps/website -- --template react
cd apps/website
npm install
```

**Step 2: Install dependencies**

```bash
npm install react-syntax-highlighter
npm install -D tailwindcss @tailwindcss/vite
npm install -D @types/react-syntax-highlighter
```

**Step 3: Configure Tailwind in `apps/website/vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**Step 4: Replace `apps/website/src/index.css` with Tailwind import**

```css
@import "tailwindcss";

:root {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

* {
  box-sizing: border-box;
}

body {
  font-family: var(--font-sans);
  background: #ffffff;
  color: #111827;
  margin: 0;
}
```

**Step 5: Replace `apps/website/index.html` title**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="envlock — secrets that never touch disk" />
    <title>envlock</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Step 6: Clear `apps/website/src/App.css`** (delete its contents entirely)

**Step 7: Verify dev server runs**

```bash
cd apps/website && npm run dev
```
Expected: Vite dev server starts at `http://localhost:5173`

**Step 8: Commit**

```bash
git add apps/website/
git commit -m "feat: scaffold apps/website with vite + react + tailwind"
```

---

## Task 2: Language Data File

**Files:**
- Create: `apps/website/src/data/languages.js`

**Step 1: Create the language data file**

```js
// apps/website/src/data/languages.js

export const languages = [
  {
    id: 'node',
    name: 'Node.js',
    icon: '⬡',
    description: 'Express, Fastify, or any Node.js server',
    command: 'node server.js',
    examplePath: 'examples/node',
  },
  {
    id: 'python',
    name: 'Python',
    icon: '🐍',
    description: 'Flask, FastAPI, Django — any Python app',
    command: 'python app.py',
    examplePath: 'examples/python',
  },
  {
    id: 'go',
    name: 'Go',
    icon: '🐹',
    description: 'Any Go binary or HTTP server',
    command: 'go run main.go',
    examplePath: 'examples/go',
  },
  {
    id: 'rust',
    name: 'Rust',
    icon: '⚙️',
    description: 'Axum, Actix, or any Rust binary',
    command: 'cargo run',
    examplePath: 'examples/rust',
  },
  {
    id: 'ruby',
    name: 'Ruby',
    icon: '💎',
    description: 'Sinatra, Rails, or plain Ruby scripts',
    command: 'ruby app.rb',
    examplePath: 'examples/ruby',
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    description: 'Spring Boot or any Java application',
    command: './mvnw spring-boot:run',
    examplePath: 'examples/java',
  },
  {
    id: 'php',
    name: 'PHP',
    icon: '🐘',
    description: 'Plain PHP or Laravel applications',
    command: 'php -S localhost:8000',
    examplePath: 'examples/php',
  },
  {
    id: 'dotnet',
    name: '.NET',
    icon: '🔷',
    description: 'ASP.NET Core minimal API',
    command: 'dotnet run',
    examplePath: 'examples/dotnet',
  },
  {
    id: 'hardhat',
    name: 'Hardhat',
    icon: '⛏️',
    description: 'Inject PRIVATE_KEY and RPC URLs at deploy time',
    command: 'npx hardhat run scripts/deploy.js',
    examplePath: 'examples/hardhat',
  },
]

export function getConfigSnippet(lang) {
  return `export default {
  onePasswordEnvId: 'your-env-id',
  commands: {
    dev: '${lang.command}',
  },
}`
}
```

**Step 2: Commit**

```bash
git add apps/website/src/data/
git commit -m "feat: add language data file"
```

---

## Task 3: Hero Section

**Files:**
- Create: `apps/website/src/components/Hero.jsx`
- Modify: `apps/website/src/App.jsx`

**Step 1: Create `Hero.jsx`**

```jsx
// apps/website/src/components/Hero.jsx
import { useState } from 'react'

export function Hero() {
  const [copied, setCopied] = useState(false)
  const installCmd = 'npm install -g envlock-core'

  function copy() {
    navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="hero" className="max-w-3xl mx-auto px-6 pt-24 pb-20 text-center">
      <span className="inline-block text-sm font-medium text-gray-500 tracking-widest uppercase mb-6">
        envlock
      </span>
      <h1 className="text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
        Secrets that never<br />touch disk
      </h1>
      <p className="text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
        Combine encrypted <code className="text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded text-base font-mono">.env</code> files
        with 1Password to inject secrets at runtime — without ever writing them to the filesystem.
      </p>
      <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-5 py-3">
        <code className="text-sm font-mono text-gray-800">{installCmd}</code>
        <button
          onClick={copy}
          className="text-xs text-gray-400 hover:text-gray-700 transition-colors font-medium"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </section>
  )
}
```

**Step 2: Replace `apps/website/src/App.jsx`**

```jsx
// apps/website/src/App.jsx
import './App.css'
import { Hero } from './components/Hero'

export default function App() {
  return (
    <div>
      <Hero />
    </div>
  )
}
```

**Step 3: Verify in browser** — hero section renders with copy button

**Step 4: Commit**

```bash
git add apps/website/src/
git commit -m "feat: add hero section"
```

---

## Task 4: How It Works Section

**Files:**
- Create: `apps/website/src/components/HowItWorks.jsx`
- Modify: `apps/website/src/App.jsx`

**Step 1: Create `HowItWorks.jsx`**

```jsx
// apps/website/src/components/HowItWorks.jsx

const steps = [
  {
    number: '01',
    title: 'Encrypt',
    description: (
      <>
        Run <code className="text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">dotenvx encrypt</code> to
        encrypt your <code className="text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">.env</code> files.
        Commit the encrypted files safely — no plaintext secrets in your repo.
      </>
    ),
  },
  {
    number: '02',
    title: 'Store',
    description: (
      <>
        The decryption key lives in <strong>1Password</strong>, not on disk.
        Every engineer pulls the same encrypted files — no <code className="text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">.env.keys</code> file to share or lose.
      </>
    ),
  },
  {
    number: '03',
    title: 'Inject',
    description: (
      <>
        Prefix any command with <code className="text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm">envlock</code>.
        Secrets are decrypted in memory and injected into your process — nothing written to disk.
      </>
    ),
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-20 border-t border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 mb-12 text-center">How it works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map((step) => (
          <div key={step.number}>
            <span className="text-4xl font-bold text-gray-100 block mb-3 select-none">
              {step.number}
            </span>
            <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

**Step 2: Add to `App.jsx`**

```jsx
import './App.css'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'

export default function App() {
  return (
    <div>
      <Hero />
      <HowItWorks />
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add apps/website/src/
git commit -m "feat: add how it works section"
```

---

## Task 5: Language Showcase (Tabs + Code)

**Files:**
- Create: `apps/website/src/components/LanguageShowcase.jsx`
- Modify: `apps/website/src/App.jsx`

**Step 1: Create `LanguageShowcase.jsx`**

```jsx
// apps/website/src/components/LanguageShowcase.jsx
import { useState } from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { languages, getConfigSnippet } from '../data/languages'

SyntaxHighlighter.registerLanguage('javascript', js)

// GitHub base URL — update when repo is public
const GITHUB_BASE = 'https://github.com/your-org/dotenvx-example/tree/main'

export function LanguageShowcase() {
  const [active, setActive] = useState(languages[0].id)
  const lang = languages.find((l) => l.id === active)

  return (
    <section id="showcase" className="max-w-4xl mx-auto px-6 py-20 border-t border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">Works with any language</h2>
      <p className="text-gray-500 text-center mb-10 text-sm">
        envlock is a CLI wrapper — it works with any runtime.
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {languages.map((l) => (
          <button
            key={l.id}
            onClick={() => setActive(l.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              active === l.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {l.name}
          </button>
        ))}
      </div>

      {/* Code panel */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-sm font-medium text-gray-700">{lang.name} — {lang.description}</span>
          <a
            href={`${GITHUB_BASE}/${lang.examplePath}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors font-medium"
          >
            Full example →
          </a>
        </div>

        {/* envlock.config.js */}
        <div className="px-5 pt-4 pb-1">
          <p className="text-xs font-mono text-gray-400 mb-1">envlock.config.js</p>
          <SyntaxHighlighter
            language="javascript"
            style={githubGist}
            customStyle={{ background: 'transparent', padding: 0, margin: 0, fontSize: '0.8125rem' }}
          >
            {getConfigSnippet(lang)}
          </SyntaxHighlighter>
        </div>

        {/* Run command */}
        <div className="px-5 pb-5 pt-2">
          <p className="text-xs font-mono text-gray-400 mb-1">Run</p>
          <code className="text-sm font-mono text-gray-800 bg-gray-50 border border-gray-200 rounded px-3 py-2 block">
            npx envlock dev
          </code>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Add to `App.jsx`**

```jsx
import './App.css'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { LanguageShowcase } from './components/LanguageShowcase'

export default function App() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <LanguageShowcase />
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add apps/website/src/
git commit -m "feat: add language showcase with tabs and code panel"
```

---

## Task 6: Examples Grid

**Files:**
- Create: `apps/website/src/components/ExamplesGrid.jsx`
- Modify: `apps/website/src/App.jsx`

**Step 1: Create `ExamplesGrid.jsx`**

```jsx
// apps/website/src/components/ExamplesGrid.jsx
import { languages } from '../data/languages'

const GITHUB_BASE = 'https://github.com/your-org/dotenvx-example/tree/main'

export function ExamplesGrid() {
  return (
    <section id="examples" className="max-w-4xl mx-auto px-6 py-20 border-t border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">Example projects</h2>
      <p className="text-gray-500 text-center mb-10 text-sm">
        Each example is a fully runnable minimal project.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {languages.map((lang) => (
          <a
            key={lang.id}
            href={`${GITHUB_BASE}/${lang.examplePath}`}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col gap-2 p-5 border border-gray-200 rounded-xl hover:border-gray-400 transition-colors"
          >
            <span className="text-2xl">{lang.icon}</span>
            <span className="text-sm font-semibold text-gray-900">{lang.name}</span>
            <span className="text-xs text-gray-500 leading-relaxed">{lang.description}</span>
            <span className="text-xs text-gray-400 group-hover:text-gray-700 transition-colors mt-auto pt-2">
              View example →
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
```

**Step 2: Add to `App.jsx`**

```jsx
import './App.css'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { LanguageShowcase } from './components/LanguageShowcase'
import { ExamplesGrid } from './components/ExamplesGrid'

export default function App() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <LanguageShowcase />
      <ExamplesGrid />
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add apps/website/src/
git commit -m "feat: add examples grid section"
```

---

## Task 7: Install CTA + Final `App.jsx`

**Files:**
- Create: `apps/website/src/components/InstallCTA.jsx`
- Modify: `apps/website/src/App.jsx` (final version)

**Step 1: Create `InstallCTA.jsx`**

```jsx
// apps/website/src/components/InstallCTA.jsx
import { useState } from 'react'

const GITHUB_URL = 'https://github.com/your-org/dotenvx-example'

export function InstallCTA() {
  const [copied, setCopied] = useState(false)
  const cmd = 'npm install -g envlock-core'

  function copy() {
    navigator.clipboard.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="install" className="border-t border-gray-100 py-24">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get started</h2>
        <p className="text-gray-500 mb-8 text-sm">
          Install envlock-core globally, then prefix any command to inject secrets.
        </p>
        <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-5 py-3 mb-6">
          <code className="text-sm font-mono text-gray-800">{cmd}</code>
          <button
            onClick={copy}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors font-medium"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Final `App.jsx`**

```jsx
import './App.css'
import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import { LanguageShowcase } from './components/LanguageShowcase'
import { ExamplesGrid } from './components/ExamplesGrid'
import { InstallCTA } from './components/InstallCTA'

export default function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <LanguageShowcase />
      <ExamplesGrid />
      <InstallCTA />
      <footer className="text-center py-8 text-xs text-gray-400 border-t border-gray-100">
        envlock — MIT License
      </footer>
    </div>
  )
}
```

**Step 3: Verify full page renders correctly in browser**

**Step 4: Commit**

```bash
git add apps/website/src/
git commit -m "feat: add install CTA and complete App.jsx"
```

---

## Task 8: `examples/node/` — Express

**Files:**
- Create: `examples/node/server.js`
- Create: `examples/node/package.json`
- Create: `examples/node/envlock.config.js`
- Create: `examples/node/.env.development`
- Create: `examples/node/README.md`

**Step 1: `examples/node/package.json`**

```json
{
  "name": "envlock-example-node",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "envlock dev"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "envlock-core": "latest"
  }
}
```

**Step 2: `examples/node/envlock.config.js`**

```js
export default {
  onePasswordEnvId: 'your-env-id',
  commands: {
    dev: 'node server.js',
  },
}
```

**Step 3: `examples/node/server.js`**

```js
import express from 'express'

const app = express()
const port = process.env.PORT ?? 3000

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from envlock + Node.js',
    secret: process.env.API_SECRET ? '[set]' : '[missing]',
    env: process.env.NODE_ENV,
  })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
```

**Step 4: `examples/node/.env.development`**

```
API_SECRET="your-secret-here"
NODE_ENV="development"
PORT="3000"
```

**Step 5: `examples/node/README.md`**

```markdown
# envlock + Node.js Example

Minimal Express server with secrets injected by envlock.

## Setup

1. Install dependencies: `npm install`
2. Encrypt your `.env.development`: `npx dotenvx encrypt -f .env.development`
3. Store the generated key in 1Password and set `onePasswordEnvId` in `envlock.config.js`

## Run

\`\`\`bash
npm run dev
# or
npx envlock dev
\`\`\`
```

**Step 6: Commit**

```bash
git add examples/node/
git commit -m "feat: add node.js example"
```

---

## Task 9: `examples/python/` — Flask

**Files:**
- Create: `examples/python/app.py`
- Create: `examples/python/requirements.txt`
- Create: `examples/python/envlock.config.js`
- Create: `examples/python/.env.development`
- Create: `examples/python/README.md`

**Step 1: `examples/python/requirements.txt`**

```
flask==3.0.3
```

**Step 2: `examples/python/envlock.config.js`**

```js
export default {
  onePasswordEnvId: 'your-env-id',
  commands: {
    dev: 'python app.py',
  },
}
```

**Step 3: `examples/python/app.py`**

```python
import os
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return jsonify({
        "message": "Hello from envlock + Python",
        "secret": "[set]" if os.getenv("API_SECRET") else "[missing]",
        "env": os.getenv("APP_ENV", "unknown"),
    })

if __name__ == "__main__":
    port = int(os.getenv("PORT", 3000))
    app.run(host="0.0.0.0", port=port, debug=True)
```

**Step 4: `examples/python/.env.development`**

```
API_SECRET="your-secret-here"
APP_ENV="development"
PORT="3000"
```

**Step 5: `examples/python/README.md`**

```markdown
# envlock + Python Example

Minimal Flask app with secrets injected by envlock.

## Setup

1. Create a virtualenv: `python -m venv .venv && source .venv/bin/activate`
2. Install deps: `pip install -r requirements.txt`
3. Install envlock: `npm install -g envlock-core`
4. Encrypt your env: `npx dotenvx encrypt -f .env.development`
5. Store key in 1Password and set `onePasswordEnvId` in `envlock.config.js`

## Run

\`\`\`bash
npx envlock dev
\`\`\`
```

**Step 6: Commit**

```bash
git add examples/python/
git commit -m "feat: add python example"
```

---

## Task 10: `examples/go/` — net/http

**Files:**
- Create: `examples/go/main.go`
- Create: `examples/go/go.mod`
- Create: `examples/go/envlock.config.js`
- Create: `examples/go/.env.development`
- Create: `examples/go/README.md`

**Step 1: `examples/go/go.mod`**

```
module github.com/your-org/envlock-example-go

go 1.22
```

**Step 2: `examples/go/envlock.config.js`**

```js
export default {
  onePasswordEnvId: 'your-env-id',
  commands: {
    dev: 'go run main.go',
  },
}
```

**Step 3: `examples/go/main.go`**

```go
package main

import (
	"encoding/json"
	"net/http"
	"os"
)

func handler(w http.ResponseWriter, r *http.Request) {
	secret := "[missing]"
	if os.Getenv("API_SECRET") != "" {
		secret = "[set]"
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Hello from envlock + Go",
		"secret":  secret,
		"env":     os.Getenv("APP_ENV"),
	})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	http.HandleFunc("/", handler)
	http.ListenAndServe(":"+port, nil)
}
```

**Step 4: `examples/go/.env.development`**

```
API_SECRET="your-secret-here"
APP_ENV="development"
PORT="3000"
```

**Step 5: `examples/go/README.md`**

```markdown
# envlock + Go Example

Minimal net/http server with secrets injected by envlock.

## Setup

1. Install envlock: `npm install -g envlock-core`
2. Encrypt your env: `npx dotenvx encrypt -f .env.development`
3. Store key in 1Password and set `onePasswordEnvId` in `envlock.config.js`

## Run

\`\`\`bash
npx envlock dev
\`\`\`
```

**Step 6: Commit**

```bash
git add examples/go/
git commit -m "feat: add go example"
```

---

## Task 11: `examples/rust/` — Axum

**Files:**
- Create: `examples/rust/Cargo.toml`
- Create: `examples/rust/src/main.rs`
- Create: `examples/rust/envlock.config.js`
- Create: `examples/rust/.env.development`
- Create: `examples/rust/README.md`

**Step 1: `examples/rust/Cargo.toml`**

```toml
[package]
name = "envlock-example-rust"
version = "0.1.0"
edition = "2021"

[dependencies]
axum = "0.7"
tokio = { version = "1", features = ["full"] }
serde_json = "1"
```

**Step 2: `examples/rust/envlock.config.js`**

```js
export default {
  onePasswordEnvId: 'your-env-id',
  commands: {
    dev: 'cargo run',
  },
}
```

**Step 3: `examples/rust/src/main.rs`**

```rust
use axum::{routing::get, Json, Router};
use serde_json::{json, Value};
use std::env;

async fn handler() -> Json<Value> {
    let secret = if env::var("API_SECRET").is_ok() { "[set]" } else { "[missing]" };
    Json(json!({
        "message": "Hello from envlock + Rust",
        "secret": secret,
        "env": env::var("APP_ENV").unwrap_or_else(|_| "unknown".to_string()),
    }))
}

#[tokio::main]
async fn main() {
    let port = env::var("PORT").unwrap_or_else(|_| "3000".to_string());
    let addr = format!("0.0.0.0:{}", port);
    let app = Router::new().route("/", get(handler));
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    println!("Listening on http://{}", addr);
    axum::serve(listener, app).await.unwrap();
}
```

**Step 4: `examples/rust/.env.development`**

```
API_SECRET="your-secret-here"
APP_ENV="development"
PORT="3000"
```

**Step 5: README.md** (same pattern as others, `cargo run` specific)

**Step 6: Commit**

```bash
git add examples/rust/
git commit -m "feat: add rust example"
```

---

## Task 12: `examples/ruby/` — Sinatra

**Files:**
- Create: `examples/ruby/app.rb`
- Create: `examples/ruby/Gemfile`
- Create: `examples/ruby/envlock.config.js`
- Create: `examples/ruby/.env.development`
- Create: `examples/ruby/README.md`

**Step 1: `examples/ruby/Gemfile`**

```ruby
source 'https://rubygems.org'
gem 'sinatra', '~> 4.0'
gem 'json'
```

**Step 2: `examples/ruby/envlock.config.js`**

```js
export default {
  onePasswordEnvId: 'your-env-id',
  commands: {
    dev: 'ruby app.rb',
  },
}
```

**Step 3: `examples/ruby/app.rb`**

```ruby
require 'sinatra'
require 'json'

set :port, ENV.fetch('PORT', 3000).to_i

get '/' do
  content_type :json
  {
    message: 'Hello from envlock + Ruby',
    secret: ENV['API_SECRET'] ? '[set]' : '[missing]',
    env: ENV['APP_ENV'] || 'unknown'
  }.to_json
end
```

**Step 4: `examples/ruby/.env.development`**

```
API_SECRET="your-secret-here"
APP_ENV="development"
PORT="3000"
```

**Step 5: Commit**

```bash
git add examples/ruby/
git commit -m "feat: add ruby example"
```

---

## Task 13: `examples/php/` — Plain PHP

**Files:**
- Create: `examples/php/index.php`
- Create: `examples/php/envlock.config.js`
- Create: `examples/php/.env.development`
- Create: `examples/php/README.md`

**Step 1: `examples/php/envlock.config.js`**

```js
export default {
  onePasswordEnvId: 'your-env-id',
  commands: {
    dev: 'php -S localhost:3000',
  },
}
```

**Step 2: `examples/php/index.php`**

```php
<?php
header('Content-Type: application/json');
echo json_encode([
    'message' => 'Hello from envlock + PHP',
    'secret'  => getenv('API_SECRET') ? '[set]' : '[missing]',
    'env'     => getenv('APP_ENV') ?: 'unknown',
]);
```

**Step 3: `examples/php/.env.development`**

```
API_SECRET="your-secret-here"
APP_ENV="development"
```

**Step 4: Commit**

```bash
git add examples/php/
git commit -m "feat: add php example"
```

---

## Task 14: `examples/dotnet/` — .NET Minimal API

**Files:**
- Create: `examples/dotnet/Program.cs`
- Create: `examples/dotnet/envlock-example-dotnet.csproj`
- Create: `examples/dotnet/envlock.config.js`
- Create: `examples/dotnet/.env.development`
- Create: `examples/dotnet/README.md`

**Step 1: `examples/dotnet/envlock-example-dotnet.csproj`**

```xml
<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
</Project>
```

**Step 2: `examples/dotnet/envlock.config.js`**

```js
export default {
  onePasswordEnvId: 'your-env-id',
  commands: {
    dev: 'dotnet run',
  },
}
```

**Step 3: `examples/dotnet/Program.cs`**

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => new {
    message = "Hello from envlock + .NET",
    secret = Environment.GetEnvironmentVariable("API_SECRET") != null ? "[set]" : "[missing]",
    env = Environment.GetEnvironmentVariable("APP_ENV") ?? "unknown"
});

app.Run();
```

**Step 4: `examples/dotnet/.env.development`**

```
API_SECRET="your-secret-here"
APP_ENV="development"
```

**Step 5: Commit**

```bash
git add examples/dotnet/
git commit -m "feat: add dotnet example"
```

---

## Task 15: `examples/java/` — Spring Boot

**Files:**
- Create: `examples/java/pom.xml`
- Create: `examples/java/src/main/java/com/example/App.java`
- Create: `examples/java/envlock.config.js`
- Create: `examples/java/.env.development`
- Create: `examples/java/README.md`

**Step 1: `examples/java/envlock.config.js`**

```js
export default {
  onePasswordEnvId: 'your-env-id',
  commands: {
    dev: './mvnw spring-boot:run',
  },
}
```

**Step 2: `examples/java/pom.xml`** — minimal Spring Boot POM

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
  </parent>
  <groupId>com.example</groupId>
  <artifactId>envlock-example</artifactId>
  <version>0.0.1-SNAPSHOT</version>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
  </dependencies>
</project>
```

**Step 3: `examples/java/src/main/java/com/example/App.java`**

```java
package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@SpringBootApplication
@RestController
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @GetMapping("/")
    public Map<String, String> index() {
        return Map.of(
            "message", "Hello from envlock + Java",
            "secret", System.getenv("API_SECRET") != null ? "[set]" : "[missing]",
            "env", System.getenv("APP_ENV") != null ? System.getenv("APP_ENV") : "unknown"
        );
    }
}
```

**Step 4: `examples/java/.env.development`**

```
API_SECRET="your-secret-here"
APP_ENV="development"
SERVER_PORT=3000
```

**Step 5: Commit**

```bash
git add examples/java/
git commit -m "feat: add java example"
```

---

## Task 16: `examples/hardhat/` — Hardhat Deploy

**Files:**
- Create: `examples/hardhat/hardhat.config.js`
- Create: `examples/hardhat/scripts/deploy.js`
- Create: `examples/hardhat/package.json`
- Create: `examples/hardhat/envlock.config.js`
- Create: `examples/hardhat/.env.development`
- Create: `examples/hardhat/README.md`

**Step 1: `examples/hardhat/package.json`**

```json
{
  "name": "envlock-example-hardhat",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "deploy": "envlock deploy"
  },
  "devDependencies": {
    "hardhat": "^2.22.0",
    "envlock-core": "latest"
  }
}
```

**Step 2: `examples/hardhat/envlock.config.js`**

```js
export default {
  onePasswordEnvId: 'your-env-id',
  commands: {
    deploy: 'npx hardhat run scripts/deploy.js --network sepolia',
    compile: 'npx hardhat compile',
  },
}
```

**Step 3: `examples/hardhat/hardhat.config.js`**

```js
/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: '0.8.24',
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_API_URL ?? '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
}
```

**Step 4: `examples/hardhat/scripts/deploy.js`**

```js
import hre from 'hardhat'

async function main() {
  console.log('Deploying with envlock — PRIVATE_KEY and ALCHEMY_API_URL injected at runtime')
  const [deployer] = await hre.ethers.getSigners()
  console.log('Deploying from:', deployer.address)
  // deploy your contract here
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

**Step 5: `examples/hardhat/.env.development`**

```
PRIVATE_KEY="your-wallet-private-key"
ALCHEMY_API_URL="https://eth-sepolia.g.alchemy.com/v2/your-api-key"
```

**Step 6: `examples/hardhat/README.md`**

```markdown
# envlock + Hardhat Example

Inject `PRIVATE_KEY` and `ALCHEMY_API_URL` at deploy time — keys never touch disk.

## Setup

1. Install deps: `npm install`
2. Encrypt your env: `npx dotenvx encrypt -f .env.development`
3. Store key in 1Password and set `onePasswordEnvId` in `envlock.config.js`

## Run

\`\`\`bash
npx envlock compile   # compile contracts
npx envlock deploy    # deploy to sepolia
\`\`\`
```

**Step 7: Commit**

```bash
git add examples/hardhat/
git commit -m "feat: add hardhat example"
```

---

## Task 17: Build & Static Export Config

**Files:**
- Modify: `apps/website/vite.config.js`
- Modify: `apps/website/package.json` (add build script)

**Step 1: Update `vite.config.js` to set base path**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  build: {
    outDir: 'dist',
  },
})
```

**Step 2: Verify build works**

```bash
cd apps/website && npm run build
```
Expected: `dist/` directory created with `index.html` and assets

**Step 3: Commit**

```bash
git add apps/website/vite.config.js
git commit -m "feat: configure static build output"
```
