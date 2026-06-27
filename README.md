# 🛠️ Job Copilot Dashboard

A high-performance, real-time **Kanban Job Application Pipeline** built with Next.js, TypeScript, and Tailwind CSS. The system utilizes a lightweight, cross-device token state engine synchronized over a secure Supabase proxy API—completely bypassing traditional password-heavy authentication.

---

## 🚀 Key System Architecture

* **Zero-Auth Cloud Syncing:** Input your personal passphrase (`ADMIN_SECRET_KEY`) on any desktop or mobile browser to instantly authorize the client and synchronize live tracking pipelines across devices.
* **Automated Data Ingestion:** Includes an optimized `POST` endpoint calibrated to receive, check for duplicates, and ingest active job metrics routed directly from an external **Make.com** automated scraper workflow.
* **Snappy Stage Transitions:** Built-in programmatic card tracking with optimistic UI updates and real-time backend updates (`PATCH`) to switch tasks between `Backlog`, `Applied`, `Interviewing`, `Offer`, and `Suspended`.
* **Algorithmic Match Engine:** Locally evaluates vector metric match scores dynamically depending on text definitions found within job payload strings.

---

## 🛠️ Environmental Variables Setup

Create a `.env.local` file in the root directory of your project and assign your production values:

```env
# Supabase Database Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_public_key_here

# Cross-Device Passphrase & Webhook Protection Key
ADMIN_SECRET_KEY=jason_platino_secure_copilot_token_2026
```
🏁 Getting Started1. Initialize System DependenciesBashnpm install
```
# or: yarn install / pnpm install / bun install
```
2. Boot Up Local Production EngineBashnpm run dev
```
# or: yarn dev / pnpm dev / bun dev
```
Open http://localhost:3000 inside your web browser to interact with the active layout sandbox.

📡 API Routing Blueprint
```
GET
Fetches matching database tracks directly from the scanned_jobs table.
```
Header Required: Authorization: Bearer <ADMIN_SECRET_KEY>
```
POST
Used by the Make.com automation web scraper to append incoming job metrics.
```
Header Required: Authorization: Bearer <ADMIN_SECRET_KEY>
```
Payload Shape: { "title": "string", "company": "string", "description": "string", "url": "string" }
```
Note: Automatically rejects matching records by URL or Title/Company groupings to eliminate data point duplication.
```
PATCH
Updates the job status field following UI drag-and-drop or column navigation events.
```
Header Required: Authorization: Bearer <ADMIN_SECRET_KEY>
```
Payload Shape: { "jobId": "uuid/string", "status": "Backlog" | "Applied" | "Interviewing" | "Offer" | "Suspended" }
```
🗄️ Database Table Schema 
To back this engine seamlessly, ensure your Supabase data model follows this structure:
```
| Column Name | Type | Constraints / Defaults |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Default: `gen_random_uuid()` |
| `created_at` | `timestamptz` | Default: `now()` |
| `title` | `text` | Not Null |
| `company` | `text` | Not Null |
| `description` | `text` | Nullable |
| `url` | `text` | Nullable |
| `status` | `text` | Default: `'Backlog'` |
```

## 🌐 Live Preview

You can access the live production environment here:
👉 **[View Live Preview](https://job-copilot-one.vercel.app)**

*Note: To view your live personalized data, ensure you input your secure system passphrase in the dashboard header.*
