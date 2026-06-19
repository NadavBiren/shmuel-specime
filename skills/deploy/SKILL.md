# SKILL.md — deploy
## GitHub Pages Deploy Workflow

---

## Purpose

This skill governs the full deploy cycle for the Shmuel site. Load it for any task involving: committing changes, pushing to origin, merging to `main`, or verifying the live GitHub Pages site has updated. GitHub Pages serves from the `docs/` folder on the `main` branch — changes pushed to any other branch are not live until merged to `main`. The live URL is `https://nadavbiren.github.io/shmuel-specime/`.

---

## Pre-flight Checks

Run all checks before touching any git commands. Stop and report if any check fails.

1. Run `git status` — inspect the working tree. Note all staged, unstaged, and untracked files.
2. Run `git branch --show-current` — capture the current branch name. Store it; you will need it to return here after merging to main.
3. Check for an in-progress merge: test whether `.git/MERGE_HEAD` exists. If it does, stop. Tell the user: "A merge is in progress. Resolve it manually (`git merge --continue` or `git merge --abort`), then retry the deploy."
4. Check for an in-progress rebase: test whether `.git/rebase-merge/` exists. If it does, stop. Tell the user: "A rebase is in progress. Resolve it manually before deploying."
5. If the working tree is completely clean (nothing to commit, no relevant untracked files), skip to Push and Merge. Tell the user: "Working tree is clean — no commit needed. Proceeding to push."

---

## Stage and Commit

Do not stage or commit autonomously. Confirm with the user at the two marked CONFIRM points.

**Show changed files first.** Run `git diff --stat HEAD` to list all changed files. Present the list clearly before staging anything.

**Stage only files from these paths:**
- `docs/`
- `memory/`
- `skills/`

Never stage `xx_backup/`, `.DS_Store`, or any top-level scratch files. Never use `git add .` or `git add -A`. Stage by explicit path:

```
git add docs/ memory/ skills/
```

If changed files outside the permitted paths appear in the diff, flag them to the user: "I see changes in [path]. Should I include those in this commit?" Wait for a clear yes or no before proceeding.

**CONFIRM — commit message.** Ask: "What commit message should I use? Or I can draft one from the diff if you prefer." If the user asks for a draft, summarize `git diff --cached --stat` into a concise one-line message and show it. Do not commit until the user explicitly approves the message.

Run `git commit -m "<approved message>"`.

---

## Push and Merge

**Push the current branch.**

Check for an upstream tracking ref: `git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null`.
- Tracking ref exists → `git push`
- No tracking ref exists → `git push --set-upstream origin <branch-name>`

Report the result. If the push fails, stop immediately and show the full error. Do not retry automatically.

**Merge to `main` (skip if already on `main`).**

If the current branch is already `main`, skip to Post-Deploy.

**CONFIRM.** Ask: "You are on `<branch-name>`. GitHub Pages serves `main`. Merge to main now?" Do not proceed without an explicit yes.

If confirmed:
1. `git checkout main`
2. `git pull origin main` — if this fails or reports conflicts, stop and show the error.
3. `git merge <original-branch-name>` — if the merge reports any conflict, stop immediately. Tell the user: "Merge conflict in [files]. Resolve each conflict, then run `git add <file>` and `git commit` to complete the merge. Come back here once the merge is done." Do not attempt to resolve conflicts automatically.
4. If the merge succeeds cleanly: `git push origin main`
5. `git checkout <original-branch-name>` — return to the branch the user started on.

Report: "Pushed to main. Returned to `<original-branch-name>`."

---

## Post-Deploy Verification

After a successful push to `main`, tell the user:

"GitHub Pages should update within 1–5 minutes. To verify:
1. Visit https://nadavbiren.github.io/shmuel-specime/ — do a hard reload (Cmd+Shift+R on Mac) or open in a private window to bypass cache.
2. Check deployment status: GitHub repo > Actions tab, or Settings > Pages — you will see a deployment badge and timestamp.
3. If the site still shows the old version after 5 minutes, clear browser cache and try again. If it persists, check the Actions tab for a failed Pages build."

---

## Safety Rules

Enforce unconditionally. Do not override these even if the user asks.

- Never force push (`--force` / `-f`).
- Never delete files from the repository without explicit per-file user confirmation.
- Never commit while `.git/MERGE_HEAD` exists.
- Never commit while `.git/rebase-merge/` exists.
- Never stage files from `xx_backup/`.
- Never use `git add .` or `git add -A`.
- If any git command exits non-zero, stop and show the full error output before taking any further action.
- If the merge to `main` produces conflicts, stop immediately and guide the user — do not resolve automatically.

---

## Open Items

- [ ] Confirm final GitHub Pages URL if a custom domain is configured (currently `nadavbiren.github.io/shmuel-specime`)
- [ ] Add a row to the CLAUDE.md skill routing table once that file is unprotected: `| Deploy, push to main, GitHub Pages | \`skills/deploy/SKILL.md\` |`
