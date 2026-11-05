# Volunify — Full-Stack Social Development Events Platform
### Local Setup Guide (VS Code)

This package contains the **complete source code** of the Volunify social development events platform, built with Next.js 16. You can run it locally in VS Code and continue developing it with AI assistants (e.g. GLM-5.3 Flash).

---

## 1. What's Inside

```
volunify/
├── src/
│   ├── app/                  # Pages + API routes (App Router)
│   │   ├── page.tsx          # Home (hero, features, recent events, gallery, newsletter)
│   │   ├── login/            # Login page
│   │   ├── register/         # Register page (password rules enforced)
│   │   ├── events/           # Browse events + details page
│   │   ├── create-event/     # Create event (protected)
│   │   ├── manage-events/    # Edit/Delete own events (protected)
│   │   ├── joined-events/    # Joined events, sorted by date (protected)
│   │   ├── profile/          # Update profile (protected)
│   │   └── api/              # REST API (events, join, auth, profile...)
│   ├── components/           # shadcn/ui components + site components
│   ├── lib/                  # auth, db, validations, constants
│   ├── middleware.ts         # Route protection (JWT check)
│   └── types/
├── prisma/
│   ├── schema.prisma         # User / Event / Participation models (MongoDB)
│   └── seed.ts               # 3 demo users + 10 sample events
├── scripts/e2e-test.mjs      # Automated end-to-end API test suite
│   (start the app with `npm start`, then run `npm run test`)
├── public/images/            # Hero + all event thumbnails included
├── .env.example              # Environment variables template
└── REQUIREMENTS.md           # Original project requirements document
```

**No sandbox-specific dependencies are used in the source code** — the AI SDK was only used to *generate* the images, never at runtime. The project is 100% portable.

---

## 2. Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | **v20 or newer** | https://nodejs.org |
| VS Code | latest | https://code.visualstudio.com |
| Package manager | npm (built-in) / bun / pnpm | — |

**Recommended VS Code extensions** (install from Extensions panel, `Ctrl+Shift+X`):
- **ESLint** (`dbaeumer.vscode-eslint`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **Prisma** (`Prisma.prisma`) — schema highlighting & autocomplete
- **Prettier** (`esbenp.prettier-vscode`)

---

## 3. Setup Steps

### Step 1 — Extract & Open
1. Extract `volunify.zip` anywhere on your computer.
2. Open the folder in VS Code: **File → Open Folder**, or from terminal:
   ```bash
   cd volunify
   code .
   ```

### Step 2 — Install Dependencies
Open the VS Code integrated terminal (`Ctrl + ~`):
```bash
npm install
```
> ⚡ This package ships a **slimmed `package.json`** — every unused dependency was
> removed, so `npm install` finishes in **~1–2 minutes** (~150 MB instead of ~800 MB).
>
> Even faster options: `bun install` or `pnpm install`.
>
> On a slow connection? Point npm at a regional mirror first:
> `npm config set registry https://registry.npmmirror.com`

### Step 3 — Configure Environment Variables
Copy the template and edit:
```bash
# Windows PowerShell
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Edit `.env`:
```env
# MongoDB Atlas connection string (Cluster → Connect → Drivers)
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/volunify?retryWrites=true&w=majority"

# Auth secret — generate your own, see below
NEXTAUTH_SECRET="replace-with-your-own-secret"

NEXTAUTH_URL="http://localhost:3000"

# OPTIONAL — Google login (leave as-is to skip; only email/password works)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

**Generate your `NEXTAUTH_SECRET`** (run once, paste the output):
```bash
openssl rand -base64 32
# Windows PowerShell: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4 — Set Up the Database (MongoDB Atlas)
Create a free cluster at https://www.mongodb.com/cloud/atlas, add your IP to **Network Access**, and create a database user. Then push the schema and seed demo data:

```bash
npm run db:setup       # prisma generate + db push + seed (3 users, 10 events)
```

> Note: MongoDB stores `id` fields as `_id` (mapped automatically in `prisma/schema.prisma`).
> Deletes cascade in application code — participations are removed before events (`src/app/api/events/[id]/route.ts`).

### Step 5 — Run the Dev Server
```bash
npm run dev
```
Open **http://localhost:3000** in your browser. 🎉

### Step 6 — Log In with a Demo Account

| Name | Email | Password |
|------|-------|----------|
| Rafiq Ahmed | `demo@volunify.test` | `Demo1234` |
| Nusrat Jahan | `nusrat@volunify.test` | `Demo1234` |
| Tanvir Hasan | `tanvir@volunify.test` | `Demo1234` |

Or register a brand-new account (password needs ≥ 6 chars, 1 uppercase, 1 lowercase).

---

## 4. Enabling Google Login (Optional)

The "Continue with Google" button is wired to NextAuth — it just needs real keys:

1. Go to https://console.cloud.google.com → create/select a project.
2. **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
3. Application type: **Web application**.
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
4. Copy the Client ID / Secret into `.env`, restart `npm run dev`.

---

## 5. Continuing Development with GLM-5.3 Flash in VS Code

Recommended workflow:

1. **Install an AI coding extension** that supports custom GLM endpoints, e.g.:
   - **Cline** (`saoudrizwan.claude-dev`) — supports any OpenAI-compatible API
   - **Continue** (`continue.continue`) — configure a GLM provider
   - **GitHub Copilot** — if your GLM access is routed through it
2. **Point the assistant at the project context:**
   - Share `REQUIREMENTS.md` (included) as the spec.
   - Key files: `prisma/schema.prisma`, `src/lib/auth.ts`, `src/middleware.ts`, `src/app/api/**`.
3. **Example prompts:**
   > "Read REQUIREMENTS.md. Add a search + event-type filter to /events using the existing Card and Select components."
   >
   > "Add pagination to GET /api/events (take 6 per page, return totalCount)."
4. **Verify changes** with `npm run dev` + `npm run lint` after each step.

---

## 6. Project API Reference (for your reference while developing)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/events?limit=6` | Public | List events (optionally filtered/limited) |
| GET | `/api/events/[id]` | Public | Single event with participant count |
| POST | `/api/events` | JWT | Create event (date must be future) |
| PUT | `/api/events/[id]` | JWT + Owner | Edit event |
| DELETE | `/api/events/[id]` | JWT + Owner | Delete event (cascades) |
| POST | `/api/events/[id]/join` | JWT | Join / cancel join (toggles) |
| GET | `/api/my-events` | JWT | Events I created |
| GET | `/api/joined-events` | JWT | Events I joined (sorted by date) |
| PUT | `/api/profile` | JWT | Update name / photo |
| POST | `/api/register` | Public | Register (server-side password rules) |
| POST | `/api/auth/[...nextauth]` | Public | NextAuth credentials + Google |

---

## 7. Troubleshooting

| Problem | Fix |
|---------|-----|
| `prisma generate` fails to download engines | Check network/proxy; or set `PRISMA_ENGINES_MIRROR` env var |
| `EADDRINUSE ::3000` | Another server is running — `npm run dev -- -p 3001` or stop the old one |
| Login loops back to login page | `NEXTAUTH_SECRET` missing/changed — set it and restart |
| `sharp` install error on Windows | `npm install --include=optional sharp` |
| MongoDB `ECONNREFUSED` / auth errors | Check the `DATABASE_URL` in `.env`: correct user/password, IP allowed in Atlas **Network Access**, database name present (`/volunify`) |
| Node version error | Next.js 16 requires Node ≥ 20 — run `node -v` to check |

---

Happy coding! 🌱
