---
agent: agent
description: Review the current PR and rate it /10 on bugs, security, improvements, technical quality, and consistency with adjacent code.
---

# PR autoreview (pass Culture)

## Context Gathering

1. Determine the main branch, then diff against it:
   - `MAIN=$(git remote show origin | sed -n '/HEAD branch/s/.*: //p')`
   - `git fetch origin "$MAIN"`
   - `git --no-pager diff "origin/$MAIN...HEAD"`
2. Read adjacent code for each modified file.
3. Check for new/modified tests related to changes.
4. If dependency files changed, audit for known vulnerabilities with the matching tool:
   - JS/TS (`package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`) → `npm audit` (or `yarn audit` / `pnpm audit`)

## Evaluation Criteria

Hints below are additional focus areas — use your own judgment to evaluate thoroughly.

1. **Bugs** (weight: critical)
2. **Security** (weight: critical)
3. **Tests & Reliability** (weight: high)
4. **Improvements** (weight: medium) — simpler libraries, unnecessary complexity, performance.
5. **Technical Quality** (weight: medium) — AHA rule: only extract when used **>3 times**.
6. **Consistency** (weight: low) — match patterns/naming/style of surrounding code.

## Severity Levels

- 🔴 **Blocker**: Must fix before merge.
- 🟠 **Important**: Should fix.
- 🟡 **Minor**: Nice to fix.

## Scoring Rules

- Any 🔴 → Overall capped at **5/10**.
- Any 🟠 → Overall capped at **7/10**.
- Bugs & Security count **2x** in weighted average.

## Output Format

```
## PR Review — <PR title>

| Criteria           | Status       | Comments |
|--------------------|--------------|----------|
| Bugs               | 🟢/🟡/🟠/🔴 |          |
| Security           | 🟢/🟡/🟠/🔴 |          |
| Tests & Reliability| 🟢/🟡/🟠/🔴 |          |
| Improvements       | 🟢/🟡/🟠/🔴 |          |
| Technical Quality  | 🟢/🟡/🟠/🔴 |          |
| Consistency        | 🟢/🟡/🟠/🔴 |          |

**Overall: X/10**

### 🔴 Blockers
### 🟠 Important
### 🟡 Minor
### 👍 What's Done Well
### Suggestions
```

## Guidelines

- Reference specific lines/files. Be actionable. Praise what's good.
- Don't nitpick formatting if a linter is configured.
- When unsure about a pattern, check similar code in the repo first.
