# SKILL.md — deploy
## Simple Git Workflow

Whenever the user asks to deploy, update the site, or push to Git, you must ONLY use this exact standard sequence without any interactive prompts, pre-flight checks, or branch merging logic:

1. Run `git add .`
2. Run `git commit -m "<write a brief, descriptive message based on the recent changes>"`
3. Run `git push`

STRICT SAFETY RULES:
- YOU MUST ALWAYS use `git add .` to stage all files.
- NEVER perform pre-flight branch checks, merge checks, or interactive prompts.
- NEVER stop to ask the user for confirmation on the commit message or the files being staged. Just execute the 3 steps directly.
