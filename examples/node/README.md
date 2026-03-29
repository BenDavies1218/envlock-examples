# envlock + Node.js Example

Minimal Express server with secrets injected by envlock.

## Setup

1. Install dependencies: `npm install`
2. Encrypt your `.env.development`: `npx dotenvx encrypt -f .env.development`
3. Store the generated key in 1Password and set `onePasswordEnvId` in `envlock.config.js`

## Run

```bash
npm run dev
# or
npx envlock dev
```
