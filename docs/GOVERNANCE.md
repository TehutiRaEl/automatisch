# automatisch — Governance

automatisch is the Workflow colony (archetype: workflow) of the Sovereign
Hive federation. This file is a short, colony-local pointer into the
federation-wide governance convention defined in
[TehutiRaEl/THEHIVE](https://github.com/TehutiRaEl/THEHIVE/blob/claude/session-continuation-owj5wr/docs/GOVERNANCE.md).

This repository is a fork of the upstream
[automatisch](https://github.com/automatisch/automatisch) project; this
governance layer is additive documentation only and does not change
upstream conventions, code style, or licensing.

## Principles

Contributions here favor reviewable, single-purpose commits; no destructive
operation (deleting data, force-pushing, dropping schema) happens without
explicit human confirmation; and any change that affects the colony's
public `/colony/*` contract or cross-repo behavior gets a human reviewer
before merge, in line with the federation-wide principles in THEHIVE's
`docs/GOVERNANCE.md`.

## Relevant Roles

The full 101-role catalog lives in
[THEHIVE/docs/ROLES.md](https://github.com/TehutiRaEl/THEHIVE/blob/claude/session-continuation-owj5wr/docs/ROLES.md).
Roles most relevant to this repo:

| # | Role Title | Responsibility |
|---|---|---|
| 11 | Workflow Colony Director | Owns automatisch's automation roadmap (upstream-aligned). |
| 25 | Workflow Automation Lead | Owns app-integration and trigger/action conventions. |
| 37 | Backend Routing Director | Owns Express router conventions. |
| 60 | Integration Architect | Owns app-connector architecture (upstream-aligned). |
| 69 | Backend Engineer (automatisch) | Implements router/connector features. |
| 77 | Test Engineer (aether, automatisch) | Writes/maintains frontend/integration test coverage. |
| 86 | Code Reviewer Apprentice (automatisch) | Performs first-pass PR review. |

## Commit / PR Convention

```
[ROLE: <Role Title>] type(scope): description

Rationale: <one sentence on why this change is needed>
```

`type` follows Conventional Commits (`feat`/`fix`/`docs`/`chore`/`refactor`/`test`).

## Enforcement

Advisory only — see `.github/workflows/governance-check.yml`. It never
fails the build and is not a required status check.
