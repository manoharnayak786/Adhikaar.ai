# Adhikaar.ai — Full MVP Plan

## 1) Executive Summary
Adhikaar.ai is an AI legal helper focused on India-specific guidance, delivering cited, trustworthy, and actionable answers in under 5 seconds. MVP delivers:
- AI-powered Q&A with citations and clear structure: Summary → Steps → Template → Where to file → Sources
- 5 use-case tracks: Traffic, Tenancy, Consumer, Police, Employment
- Templates with one-tap copy/download and where-to-file guidance
- Case Wallet to save generated answers/docs (client-first, privacy-forward), and SOS panel with verified helplines
- Google OAuth login (Emergent Auth). Dark, premium UI aligned to provided palette and design guidelines

Status blueprint (phased):
- Phase 1: Frontend UX shell, brand + routing — In Progress
- Phase 2: Auth + Sessions — Not Started
- Phase 3: AI Q&A + Citations — Not Started
- Phase 4: Use-case templates + Rights Library — Not Started
- Phase 5: Case Wallet (save/export) — Not Started
- Phase 6: SOS + i18n scaffolding + A11y — Not Started
- Phase 7: Testing, Perf & Polish — Not Started

## 2) Objectives
- Deliver cited, India-specific answers in <5s median latency
- Ship 5 core use cases with actionable outputs (checklist, template, where-to-file)
- Establish trust via security badges, on-device-first mindset for wallet, clear disclaimers, verified sources
- Keep scope focused on guidance, not attorney-client relationship or litigation strategy

## 3) UI/UX Design Guidelines (applied)
- Palette (dark): background #0B0F14, surface #121923, card #0F141B, text #E8EEF4, subtext #A7B4C2, accentMint #35E0B8, accentIndigo #6CA8FF, success #15C27E, warning #FFB020
  - Per design guidelines, use #35E0B8 (mint) for primary call-to-actions; #6CA8FF (indigo) for links/secondary accents; avoid purple entirely
- Typography: EB Garamond for headings (authority), Inter for body (readability). Define semantic scale (h1–h6, body, subtle)
- Components: Use Shadcn/UI exclusively (Button, Input, Card, Accordion, Tabs, Command, Table, Sonner for toasts). Icons: lucide-react
- Tokens: Implement CSS variables from design_guidelines.md; enable dark mode by default via html.dark
- Data states: Skeletons for >300ms loads; explicit empty/error states with retry
- Motion: Short transitions (150–250ms), animate transform/opacity only; never use transition: all
- Gradients: Decorative only in hero/section backgrounds, <20% viewport coverage
- Testability: Every interactive/critical info element has data-testid
- Accessibility: WCAG AA contrast, keyboard-friendly focus rings using --ring, aria-live for answer loading
- Logo direction: Geometric shield with embedded letter “A” (scale-of-justice as crossbar), primary in #35E0B8; SVG inline for pixel-perfect rendering

## 4) Implementation Steps (Phased)

### Phase 1 — Frontend UX Shell, Brand & Routing (In Progress)
- Set global tokens in index.css from design_guidelines.md; ensure html element has class="dark"
- Add EB Garamond + Inter font imports; set font-display for headings and font-sans for body
- Build core layout with sticky Header: logo shield “A”, Adhikaar.ai Secure and 24/7 badges, Login/Start buttons
- Home hero: headline, subhead, AI search bar with hint chips; use-case chips (Traffic, Tenancy, Consumer, Police, Employment)
- Pages/routes (React Router):
  - / (Ask/Home), /wallet, /library, /sos, /templates/:id, /profile
- Components: AnswerBlock (with Sources accordion), TemplateCard (copy/download), CaseWallet (tabs: Documents, Timeline), SOS panel
- Toaster (Sonner) and skeletons; all interactive elements include data-testid

### Phase 2 — Auth & Sessions (Emergent Google OAuth)
- Login button redirects to https://auth.emergentagent.com?redirect=${encodeURIComponent(appUrl)}
- After auth, frontend captures #session_id from URL, calls Emergent session endpoint, posts token to backend
- Backend stores session_token (Mongo) with 7-day expiry (timezone-aware) and sets httpOnly secure cookie
- Endpoints: POST /api/auth/session, POST /api/auth/logout, GET /api/auth/me
- Middleware: Attach user context from cookie session_token

### Phase 3 — AI Q&A with Citations
- Use emergentintegrations LlmChat with OpenAI provider and model gpt-4o (primary) or gpt-4o-mini (speed)
- Prompting pipeline:
  1) Detect language + classify useCase from chips/query
  2) Retrieve candidate sources (India Code, govt portals, police/transport portals, NCH/Consumer Affairs) via search connector
  3) RAG answer: structure: Summary → Steps → Template preview → Where to file → Sources
  4) Safety filter (violence/self-harm/illegal intent) → gate to SOS
- Backend routes:
  - POST /api/v1/ask { query, lang, context: { useCase } } → { answer (md), steps[], template, sources[] }
- Concurrency: run web retrieval + model call with asyncio.gather; enforce timeout budget to keep <5s median

### Phase 4 — Templates & Rights Library
- Templates per use-case (letters, notices, complaints) with slots (name, address, dates, transaction IDs)
- Library search route: GET /api/v1/library/search?q= → results[] (curated docs + indexed snippets)
- Rights Library UI: Command palette + filters (Act/Govt/Court). Result items link to sources

### Phase 5 — Case Wallet
- Save answer or template as doc; save timeline events; tags
- Endpoints: POST /api/v1/wallet/save, GET /api/v1/wallet/list, DELETE /api/v1/wallet/:id
- On-device-first: Design for client-side encryption using Web Crypto; MVP stores plaintext with clear disclaimers; M2 adds encryption toggle

### Phase 6 — SOS, i18n & A11y polish
- SOS panel with verified helplines (Police 112, Women 181, Legal Aid directories). Mobile sticky action bar on rights pages
- i18n scaffolding for en/hi/te (labels, hints, category names). MVP: English; M2: add hi/te copies
- A11y: aria-live regions, focus traps in dialogs, skip links

### Phase 7 — Testing, Performance & Polish
- Automated tests (frontend + backend), lighthouse-like pass for accessibility
- Telemetry KPIs: median_response_time_sec, citation_precision, template_download_rate, wallet_saves_per_session, sos_click_rate
- Smoke test user flows: login, ask, view citations, copy/download template, save to wallet, SOS

## 5) Technical Details

### Frontend
- Stack: React + React Router + Tailwind + Shadcn/UI + Sonner + lucide-react
- Required components (named exports): Header, SearchBar, UseCaseChips, AnswerBlock, TemplateCard, CaseWallet, SOSPanel, RightsLibrary
- Data-testid for all actionable elements. Icons exclusively from lucide-react. Toasts via Sonner themed to mint/indigo (avoid red/green defaults)
- Fonts: Load EB Garamond (display) + Inter (sans). Apply via utility classes from design_guidelines.md
- Theming: Use tokens from design_guidelines.md; gradients limited to hero/section wrappers only

### Backend
- FastAPI on 0.0.0.0:8001, Mongo via MONGO_URL (motor). UUIDs for ids, timezone-aware datetimes
- Pydantic models for all responses. Route order: specific before generic
- Collections: users, sessions, wallet_docs, templates, library, ask_logs
- API routes (prefix /api):
  - POST /api/v1/ask
  - GET  /api/v1/library/search
  - POST /api/v1/wallet/save
  - GET  /api/v1/wallet/list
  - DELETE /api/v1/wallet/{doc_id}
  - POST /api/auth/session, POST /api/auth/logout, GET /api/auth/me
- Web search connector (initial):
  - Option A (no key): DuckDuckGo HTML lite scrape for gov/court domains to retrieve 3–5 candidate links (UNVERIFIED fallback)
  - Option B (preferred): SerpAPI/Bing with API key for reliable citations (requires key later)

### AI Integration
- Library: emergentintegrations.llm.chat (LlmChat). Provider: openai. Model: gpt-4o (primary) with fallback gpt-4o-mini
- Key: Read from env EMERGENT_LLM_KEY (never hardcode)
- System prompt: Indian legal helper with strict citation policy; produce structured output + sources; avoid definitive legal advice; use neutral, simple language
- RAG: Simple retrieve-then-generate with rerank (later); embed curated anchors for India Code + govt portals; cite sections/anchors when available

### Data Models (Mongo, UUID ids)
- User { id, email, name, picture, created_at }
- Session { id, user_id, token_hash, expires_at }
- WalletDoc { id, user_id, title, content_md, tags[], timeline[], created_at }
- Template { id, use_case, title, body_md_with_slots, fields[], last_updated }
- LibraryEntry { id, title, snippet, url, source_type, tags[], last_updated }
- AskLog { id, user_id?, query, lang, use_case, answer_ms, sources[], created_at }

### Security & Compliance
- Cookies: httpOnly, secure, samesite=strict (or none if cross-site), path="/"
- Disclaimers: no attorney-client relationship; provide free legal aid links
- Privacy: anonymize logs; default 90-day retention for non-wallet items; user-controlled deletion for wallet
- Rate limiting (later): simple per-IP on ask endpoint

## 6) Next Actions
- Implement Phase 1 UI shell per design_guidelines.md (header, hero, chips, search, toasts)
- Add routes and placeholder pages with skeletons and empty states
- Scaffold backend routes and models (stub returning mock data) to unblock frontend
- Integrate Emergent Auth login/logout flow
- Wire LlmChat with EMERGENT_LLM_KEY + basic retrieval for citations; enforce 5s timeout
- Populate 5 use-case templates and library seeds
- Instrument KPIs and ship first preview for feedback

## 7) Success Criteria
- Median end-to-end ask response under 5 seconds with at least 2 verified citations (gov.in/nic.in/indiacode)
- All 5 use cases reachable via chips, each producing: steps, template, where-to-file, sources
- One-tap Copy/Download works; Wallet save/retrieve works; SOS buttons visible and functional
- Auth: Google OAuth end-to-end works; session cookie persists 7 days; logout clears session
- UI passes AA contrast, uses tokens/typography, adheres to gradient rules, includes testids for all interactions

---
Plan Owner Notes:
- Keep plan.md updated as phases progress; mark Phase 1 → COMPLETED when UI shell ships; clear todo between phases.
- Any third-party search integration must go through integration playbook and use environment keys; avoid hardcoded secrets.
