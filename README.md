# dotenvx Example

A [T3 Stack](https://create.t3.gg/) project with encrypted multi-environment configuration using [dotenvx](https://dotenvx.com/) and [1Password CLI](https://developer.1password.com/docs/cli/).

## How It Works

This repo keeps **encrypted** `.env` files committed to git — one per environment. **No plaintext secrets exist on disk or in the repository.** This means secrets cannot be accidentally leaked through git history, code review tools, AI context windows, or any process that reads local files. Decryption only happens in memory at runtime. Two tools work together to make this possible:

1. **dotenvx** encrypts and decrypts `.env` files using public/private key pairs. The encrypted files (`.env.development`, `.env.staging`, `.env.production`) are safe to commit.

2. **1Password CLI (`op`)** stores the decryption keys so no engineer needs a local `.env.keys` file. The wrapper script `scripts/env.sh` fetches keys from 1Password at runtime and passes them to dotenvx.

### Data Flow

```
1Password Vault
  └─ Environment (holds DOTENV_PRIVATE_KEY_*)
       │
       ▼
scripts/env.sh
  ├─ op run  →  injects DOTENV_PRIVATE_KEY_* into process env
  └─ dotenvx run -f .env.<env>  →  decrypts the env file in memory
       │
       ▼
  next dev / next build / next start
       │
       ▼
  src/env.js  →  Zod validates all variables at boot
```

### Key Files

| File | Purpose | Committed? |
|------|---------|------------|
| `.env.development` | Encrypted dev variables | Yes |
| `.env.staging` | Encrypted staging variables | Yes |
| `.env.production` | Encrypted production variables | Yes |
| `src/env.js` | Zod schema — validates all env vars at build/boot | Yes |
| `scripts/env.sh` | Wrapper that fetches keys from 1Password and runs the command | Yes |

### Environment Variables

The app currently expects:

| Variable | Scope | Description |
|----------|-------|-------------|
| `NODE_ENV` | Server | `development`, `staging`, or `production` |
| `DATABASE_URL` | Server | PostgreSQL connection string |
| `API_SECRET` | Server | Secret key for API authentication |
| `NEXT_PUBLIC_APP_URL` | Client | Public-facing app URL |

These are defined and validated in `src/env.js`. Any missing or invalid variable will fail the build.

### Adding Un-encrypted environment variables

You can freely add environment variables should you require an override of an encrypted ENV or an extra env for testing / building a new feature.

```javascript
NODE_ENV="encrypted:BHEP9Bdedd9DakH+trgOX/qYqALzjcvk2zifxS9pwleQsI+6naDx1ceDeto6O0Uk+zYXhx3JrhS0S8+aUbZHRmSaZ2pBpL3Aii5QvR1NwBST8nJJeqWPhCqPI+iP1UNorq9gT976rLBet7Cx"
DATABASE_URL="encrypted:BNcoXo5bRxc+n10q+fQZkERmIj9wwaDUQn91id6sItJhH06IeRdog/cxE7xavfv8BiaXZWxf5GJeVxHAbGAcycDgtt7BIrpyE99glKMyt9gdA2K/BhfLI+AcO1HVfJb+4GhoME34pjunxXYhxusaG6eHYLQTkvMrNpFZl+CvTUY1hGxGqcKeFw=="
NEXT_PUBLIC_APP_URL="encrypted:BP/9JcJI30oIj9SzXCaQ6hSKaXrz+bS/vIBvIY0P65U04EpX8r1E7lrKVuOMgsb1Y3ZKPFCBTjwQZm8c1xXukMdUiQV908/PpmlZ/AgYtFX7B+TnOebAgNOwyYUgtm+TxzpFSFJBDPXCLFYO5CSlJHSOpXIr2A=="
API_SECRET="encrypted:BI117znA34rpwFPpGMlgZbmrRZaaZ2IQERnM0yygAVm/F8+JTGQtX+GWonPibjr7NdVLt04N1PVEl7WluUV/JnFe1l5St4Nq0AFVOQkOAQOPYAigjZLaja65mqZsZXSVx5Q9E58pkhcWyM1LUdi+ir9IdyMK"

EXTRA_ENV_VARIABLE="Not encrypted, just a regular variable for development environment"
```

## Local Setup & Development Process

### Prerequisites

```bash
brew install node                          # Node.js 20+
brew install --cask 1password-cli@beta      # 1Password CLI
```

```bash
node -v        # 20+
pnpm -v        # 10+
op --version   # 2.33.0+
```

### Step 1 — Install dependencies

```bash
pnpm install
```


### Step 2 — Enable 1Password CLI in the 1Password app

1. Open the **1Password** desktop app
2. Go to **Settings** → **Developer**
3. Enable **Integrate with 1Password CLI**

![onePassCli Settings](./onePassCli.png)


### Step 3 — Sign in to 1Password CLI

```bash
op signin
```

If you have the 1Password desktop app make sure to run with biometric unlock enabled this makes it much faster, the CLI will authenticate through it automatically until your session auto locks. auto lock settings can be adjusted should you need to only unlock once a day or something.

![autolock.png](./autolock_setting.png)

### Step 4 — Get access to the 1Password Environment

Ask a team member to share the 1Password Environment that contains the dotenvx decryption keys. You need the **Environment ID** — for this example I have already commit it for local testing, so if you have access to the vault, you are good to go.

> The Environment ID for this test app is `ca6uypwvab5mevel44gqdc2zae`. Each project will be assigned a different environment ID, this IS NOT the decryption key. But being said we probably don't need to commit this to github.

### Step 5 — Run the app

```bash
# Development (default) so no need to pass any flags
pnpm dev
pnpm build
```

### Running Against Other Environments

```bash
pnpm dev --staging
pnpm dev --production

pnpm build --staging
pnpm build --production
```

### Check the server console

You should see the both the encrypted envs and unencrypted envs have are available for use within the application.

### Benefits

- **No plaintext secrets on local machine** — Encrypted values are safe to commit, so secrets never appear in pull requests, git history, or code review tools.
- **No local `.env.keys` file** — Decryption keys live in 1Password, not on disk. Nothing sensitive to lose or accidentally share.
- **Decryption happens in memory** — Secrets are never written to the filesystem, reducing exposure to AI context windows, log scrapers, or other tooling that reads local files.
- **Single source of truth** — Every engineer pulls the same encrypted env files from the repo.
- **Environment parity** — Development, staging, and production configs follow the same pattern, reducing environment-specific surprises.
- **Supports unencrypted values** — Developers can freely add plaintext variables for local feature work without affecting the encrypted values.

### Potential Risks

A pre-commit hook should be added to guard against accidental leaks:

- **`scripts/env.sh`** — Should not be committed with a real Environment ID. A user would still need a 1Password account with access to the Labrys workspace, but the ID does not need to live in the repository.
- **`.env.development` / `.env.staging` / `.env.production`** — Commits to these files should be reviewed carefully to ensure no plaintext secrets are included alongside the encrypted values.

> **Consideration:** Adding `.env.*` to `.gitignore` and providing commands for pulling and encrypting env files locally on project setup would eliminate some risk should the decryption key every be leaked. This would require an additional onboarding step for engineers.
