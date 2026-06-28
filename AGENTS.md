# Torsen Website — Agent Instructions

Instructions for AI coding agents (Claude Code, Codex, GitHub Copilot) working in this repo.

## Agent skills

### Issue tracker

Issues & PRDs live in this repo's GitHub Issues (`cytabtorsen/Torsen-webiste`), managed via the `gh` CLI. External pull requests are also a triage surface — `/triage` pulls them into the same queue as issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Five canonical triage roles, using their default label names (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Multi-context layout: `CONTEXT-MAP.md` at the root points to per-context `CONTEXT.md` files (created lazily by `/domain-modeling`, not upfront). See `docs/agents/domain.md`.
