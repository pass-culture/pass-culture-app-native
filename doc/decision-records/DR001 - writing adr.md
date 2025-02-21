# Title : DR001 - Drawing up Decision Records to track structuring decisions

> Status : ~~Projet-~~ Proposé ~~- Adopté - Remplacé - Retiré~~

## Context

We need a structured way of documenting and sharing technical decisions within the project. The lack of traceability of decisions can lead to a loss of context and inconsistent choices over time. What's more, it's essential to involve the teams in formalising technical choices and to ensure that knowledge is passed on effectively.

Architecture Decision Records (ADRs) offer a simple and effective approach to recording these decisions in a permanent way. They give the whole team easy access to the history of decisions and an understanding of their rationale.

## Decision

We are adopting Architecture Decision Records (ADRs) as the standard method of documenting **architectural and technical** decisions.
Each significant decision will be recorded in a **markdown file** within the code repository under a **dedicated directory** `/doc/decision-records/file_name.md`.

**file_name** = `DR + nnn + " - " + (the decision text limited to 64 chars)`.

> e.g.: DR001 - writing adr.md

The format used is that of [Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

The template to use is `/doc/decision-records/DR000 - template.md`

The following principles will guide the use of ADRs:

1. **A facilitation and documentation tool**
ADR is not limited to documentation, it also serves to **explain and share the decisions taken**, thus improving collaboration within the team.
1. **markdown** as-code format
The use of the markdown format allows seamless integration into developers' day-to-day work, encouraging adoption and regular use.
1. **Trace all decisions**
At the start, we recommend documenting all decisions (not a wording or a two lines changement, be smart to collect only meeingfull decisions), even minor ones. Over time, we will refine the granularity according to the maturity of the team. The objective is to make an habit.
1. **Event-driven and durable documentation**
An ADR is never obsolete: it represents a decision taken at a given moment with the corresponding context. A new decision may supplement or amend it, but it remains a valuable historical record.
1. **Collective responsibility**
Each developer and team member must be encouraged to write and maintain ADRs to ensure they are relevant and complete.

## Alternatives considered

* Do not document decisions, relying on collective memory.
* Only use Git, PR or Jira history
* Use an external document management tool such as Notion.

## Justification

Makes it easier to monitor decisions and ensure that they are understood by the whole team.

Integrates directly into the developers' workflow, increasing the chances of adoption.

Prevents loss of information when teams change or members rotate.

[More to read](https://blog.octo.com/architecture-decision-record) by Octo.

## Consequences

Requires an initial effort to draft the first ADRs.

Requires discipline in the team to keep this documentation up to date.

At the start of the project, we need to draw up at least one decision per version. Thereafter, one decision per sprint is a good pace. If we plot less, we're probably missing important decisions.

## Actions to be implemented

1. Create a `/doc/decision-records` directory in the main project repository.

1. Draft this first ADR to set out the framework and adoption principles.

1. Train the team in writing and updating ADRs.

1. Integrate the review of ADRs into the code review workflow.

1. Conduct a quarterly review to adjust and improve practices based on feedback from the teams.
