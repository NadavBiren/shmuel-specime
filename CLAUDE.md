# CLAUDE.md — Shmuel_pagmar-font
## Master Orchestrator & Core Directives

---

## Project Identity

Shmuel is a Hebrew serif variable font based on medieval "Medium script" (כתב בינוני). This project produces a two-page interactive typography specimen website: a Specimen Page showcasing the font's variable axes and typographic density, and a Research Page documenting the historical digitization process. The site is Hebrew-primary with RTL layout. Tech stack: Vanilla HTML, CSS, JS. No frameworks without explicit justification. All deliverables live in `site/`.

---

## Session Model

Every session is task-driven. Do not assume continuity from the previous session. At the start of each session:

1. Read `memory/project-log.md` to establish current state
2. Read `memory/decisions.md` to load active constraints
3. Wait for an explicit task before acting

Do not propose work speculatively. Execute what is asked.

---

## Skill Routing

Load the relevant SKILL.md before working on any task in that domain. Skills are not mutually exclusive — load more than one when a task spans domains.

| Task type                                       | Load skill                        |
|-------------------------------------------------|-----------------------------------|
| Font history, script anatomy, typographic logic | `skills/type-identity/SKILL.md`   |
| Page structure, layout, user flow               | `skills/ux-architecture/SKILL.md` |
| Animation, interaction, creative dev logic      | `skills/interaction/SKILL.md`     |
| CSS vars, tokens, code conventions, tech stack  | `skills/design-system/SKILL.md`   |

---

## Permission Model

### Claude Code may do autonomously:
- Read any file in the project
- Write and update all files in `memory/`
- Create new files in `site/` when explicitly instructed
- Modify existing files in `site/` when explicitly instructed
- Create or update files in `skills/` when building or refining a skill

### Claude Code must not do without explicit instruction:
- Delete any file
- Modify `CLAUDE.md` itself
- Introduce a new dependency, library, or framework
- Change the site's language direction or layout model

---

## Memory Protocol

Memory updates are autonomous. Apply the following rules:

**`memory/project-log.md`**
Update after any completed task, milestone, or meaningful structural change. Log: date, task completed, current state, next logical step. Keep entries concise. Once an entry is older than 3 milestones and no longer affects current work, compress it to a single summary line.

**`memory/decisions.md`**
Update when a technical or design decision is made that constrains future work. Log: decision, rationale, what it rules out.

**`memory/preferences.md`**
Update only when a collaboration rule, working style preference, or tone directive is explicitly stated or meaningfully refined.

When in doubt whether something is worth logging — log it. Overlogging is cheaper than losing context.

---

## Collaboration Tone

Peer-level. Direct. No validation noise. Challenge weak directions. Propose alternatives when something doesn't serve the project. Be precise about typography — this is a specialist project and terminology matters. Write all prose in .md files as continuous lines. Do not insert hard line breaks within paragraphs.

---

## Stack Constraints (current)

- Vanilla HTML, CSS, JS
- RTL layout (`dir="rtl"`, `direction: rtl`)
- Variable font via `@font-face` with `font-variation-settings`
- No build tools unless explicitly introduced
- All font files in `site/assets/fonts/`
- Hebrew-primary. English only where functionally unavoidable.