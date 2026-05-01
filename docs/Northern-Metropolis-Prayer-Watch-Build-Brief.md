# 北都呼聲禱告守望平台 — Codex Build Brief / Master Prompt

## 產品定位
「北都呼聲」應定位為**可信內容中心 + 禱告回應平台 + 低人手行政後台 + 可擴展 AI 草稿助手**，而非大型社交平台。

核心使命：
- 支援香港教會為北部都會區長期守望與禱告。
- 幫助牧者與同工以可管理、可審批、可追溯的方式發布與整理內容。
- 以低技術門檻、低行政負擔方式動員信徒參與。

## MVP 原則
1. 公開內容必須可信且經審批。
2. 使用者提交內容不可未審批公開。
3. AI 只可產生草稿，不能自動發布。
4. 不可捏造人名、教會名、統計、活動、經文或政策事實。
5. 平台服侍教會，不取代教會。

## 建議技術棧
- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres / Auth / Storage / RLS)
- Vercel 部署
- Resend（或同級 transactional email）
- 後續加入 OpenAI API / Gemini API 作 AI 草稿助手

## 資訊架構（公開前台）
1. Home
2. Vision
3. Prayer Updates
4. Prayer Item Detail
5. Regional Prayer Wall
6. Pastor Responses
7. Prayer Walk Teams
8. Events
9. Testimonies
10. Contact / Join
11. Privacy Policy

## 管理後台（Admin）
1. Dashboard Overview
2. Prayer Items Management
3. Submissions Review
4. Pastor Responses Management
5. Team Signups Management
6. Events Management
7. Weekly Summary Builder
8. Audit Log

## 權限與安全
- 角色：`super_admin`, `admin`, `editor`, `reviewer`
- 所有關鍵表啟用 Supabase RLS
- 公開訪客只可讀 `published` 內容
- 公開訪客只可新增 submissions / signups，不可讀取
- editor 可寫草稿不可發布；admin 才可審批發布
- service role key 僅限 server-side，禁止暴露 client

## AI 防幻覺規則
- AI 僅做整理/分類/摘要/格式化
- AI 不可生成未提供之事實與人物
- 所有 AI 輸出附註：`AI-generated draft. Please review before publishing.`
- AI 草稿必須進入 draft workflow 並由人工審批

## 視覺與可用性方向
- White-based, calm, readable, mobile-first
- Liquid Glass 僅點綴於 card/nav/filter/CTA
- 長文區域避免高透明玻璃效果
- 支援 `prefers-reduced-motion`
- 目標 WCAG 2.2 AA

## 分期建議
- Phase 0: 規格與流程定義（不寫程式）
- Phase 1: 靜態前台與 mock data
- Phase 2: Supabase schema / auth / RLS
- Phase 3: 表單與審批流程
- Phase 4: 內容生產（weekly summary / events / audit）
- Phase 5: AI draft assistant（僅草稿）
- Phase 6: 測試、部署、文件

## Master Prompt（可直接給 Codex）

```text
You are building a production-quality MVP for a Christian prayer watch and mobilisation platform called “北都呼聲禱告守望平台” / “Northern Metropolis Prayer Watch Platform”.

This is NOT a generic social media platform. It is a trusted, moderated, church-friendly digital platform that helps pastors, churches, Christian leaders, and prayer groups publish prayer updates, share regional needs, invite pastoral responses, organise prayer walk teams, and reduce administrative burden through structured workflows.

Mission:
Use technology to support a spiritual prayer movement for the Northern Metropolis development in Hong Kong. The platform should be simple, calm, credible, easy for pastors and older church users, and scalable for future AI-assisted administration.

Important product principles:
1. Public content must be trusted and moderated.
2. User submissions must never appear publicly without admin approval.
3. AI must only generate drafts. AI must never auto-publish.
4. Do not invent facts, pastor names, church names, statistics, events, or Bible references.
5. All factual content about Northern Metropolis must be entered by admin or sourced explicitly.
6. The platform is to serve churches, not replace churches.
7. The design must be modern, white-based, calm, and “Liquid Glass inspired”, but readability and accessibility must come first.

Tech stack:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase for Postgres database, Auth, Storage, and Row Level Security
- Deploy-ready for Vercel
- Optional: shadcn/ui and lucide-react for accessible UI components
- Optional later: OpenAI API or Gemini API for AI draft assistant
- Do not expose service role keys to the browser
- Use server actions or route handlers for protected operations

Design direction:
- White and warm off-white base
- Soft blue, muted gold, and gentle green accents
- Liquid Glass inspired cards and navigation, using subtle transparency, blur, border, and soft shadows
- High readability for Traditional Chinese
- Fonts: Noto Sans TC for Chinese, Inter for English
- Mobile-first
- Use generous spacing, calm layout, and clear call-to-action
- Do not overuse glass effect on long-form text
- Provide fallback for browsers that do not support backdrop-filter
- Respect prefers-reduced-motion
- WCAG 2.2 AA-oriented accessibility

Core public pages:
1. Home
2. Vision
3. Prayer Updates
4. Prayer Item Detail
5. Regional Prayer Wall
6. Region Detail
7. Pastor Responses
8. Prayer Walk Teams
9. Events
10. Testimonies
11. Join / Contact
12. Privacy Policy

Core admin pages:
1. Admin dashboard overview
2. Prayer item management
3. Submission review queue
4. Pastor response management
5. Event management
6. Team signup management
7. Weekly summary builder
8. AI draft assistant page
9. Audit log
10. Settings

User roles:
- super_admin: full access, manage users and settings
- admin: publish, approve, manage content
- editor: create and edit drafts, cannot publish
- reviewer: review submissions and add notes, cannot publish

Database schema:
Create tables:
- profiles
- regions
- topics
- prayer_items
- submissions
- pastor_responses
- events
- team_signups
- weekly_summaries
- ai_drafts
- audit_logs
- site_settings

Data model requirements:
- prayer_items must support draft, pending_review, published, archived
- submissions must support new, reviewing, approved, rejected, converted
- pastor_responses must support video, text, audio
- weekly_summaries must support selected prayer items
- team_signups must include privacy consent and follow-up status
- audit_logs must record important admin actions
- all public queries must only return published content
- submissions and signups must never be publicly readable

Security requirements:
- Enable Supabase Row Level Security on all relevant tables
- Public users can only read published content
- Public users can create submissions and team_signups, but cannot read them
- Only admins can view submissions and signups
- Only admins can publish
- Validate all forms with Zod
- Sanitize rich text or avoid rich text in MVP
- Prevent XSS
- Do not render untrusted HTML
- Rate-limit public form submissions if possible
- Use environment variables correctly
- Never expose Supabase service role key client-side
- Add audit logs for create, update, approve, publish, archive, export

AI assistant requirements:
AI features are optional but create the structure for them.
AI must only produce drafts for admin review.
AI assistant should support:
1. Convert pastor notes into prayer item draft
2. Classify prayer item by region and topic
3. Generate weekly prayer summary draft from selected published prayer items
4. Generate WhatsApp-friendly short announcement draft
5. Generate email newsletter draft

Anti-hallucination rules:
- AI must not invent facts, numbers, locations, events, pastor names, churches, Bible verses, or testimonies.
- AI output must include a warning: “AI-generated draft. Please review before publishing.”
- Store source_text, generated_output, model_name, prompt_version, status, reviewed_by, created_at.
- AI drafts must not be visible publicly.
- Admin must manually approve or copy into a content item.

Public content seed:
Use only placeholder content unless content is explicitly provided.
Use Traditional Chinese as default interface language.
Prepare bilingual-ready structure but MVP can display Traditional Chinese first.

Required components:
- SiteHeader
- MobileNav
- GlassCard
- SectionHeader
- PrayerCard
- RegionCard
- PastorResponseCard
- EventCard
- CTASection
- StatusBadge
- AdminSidebar
- AdminTopbar
- DataTable
- FormField
- EmptyState
- LoadingState
- ErrorState
- ConfirmDialog
- WeeklySummaryPreview
- AIWarningBanner

UI acceptance criteria:
- Clean, modern, white-based interface
- Liquid Glass effect used only for cards, nav, filters, and CTA blocks
- Body text must remain highly readable
- Works well on iPhone, iPad, desktop
- Navigation must be simple enough for elderly church users
- Every public page must have a clear next action
- Forms must be short and easy to complete
- Form errors must be clear in Traditional Chinese
- The site should feel peaceful, prayerful, credible, and contemporary

Functional acceptance criteria:
1. Visitor can view published prayer items.
2. Visitor can filter prayer items by region and topic.
3. Visitor can submit a prayer need.
4. Visitor can sign up to join or lead a prayer walk team.
5. Admin can log in.
6. Admin can create, edit, publish, archive prayer items.
7. Admin can review submissions.
8. Admin can convert approved submission into prayer item draft.
9. Admin can manage pastor responses.
10. Admin can manage events.
11. Admin can generate a weekly summary draft.
12. Admin can export team signups as CSV.
13. Public users cannot see private submissions or signups.
14. Audit log records key admin actions.
15. App is deploy-ready to Vercel.

Project structure:
Use a clear structure similar to:
/app
  /(public)
    /page.tsx
    /vision/page.tsx
    /prayer/page.tsx
    /prayer/[slug]/page.tsx
    /regions/page.tsx
    /regions/[slug]/page.tsx
    /pastor-responses/page.tsx
    /teams/page.tsx
    /events/page.tsx
    /contact/page.tsx
    /privacy/page.tsx
  /admin
    /page.tsx
    /prayer-items/page.tsx
    /submissions/page.tsx
    /pastor-responses/page.tsx
    /events/page.tsx
    /teams/page.tsx
    /weekly-summary/page.tsx
    /ai-drafts/page.tsx
    /audit-log/page.tsx
/components
  /public
  /admin
  /ui
/lib
  /supabase
  /validations
  /ai
  /utils
/database
  schema.sql
  seed.sql

Deliverables:
1. Build the full Next.js project.
2. Implement the database schema and RLS policies.
3. Create seed data for regions and topics.
4. Build the public pages with mock/published data.
5. Build the admin dashboard.
6. Implement forms and validation.
7. Implement CSV export.
8. Implement audit log.
9. Prepare AI draft assistant structure but keep publishing manual.
10. Provide setup instructions in README.
11. Provide a UAT checklist.
12. Provide deployment instructions for Vercel and Supabase.

Before coding:
First produce:
- Architecture plan
- Sitemap
- Database schema plan
- RLS policy plan
- Component plan
- UX flow
- Security checklist
- Build sequence
Then implement step by step.
```
