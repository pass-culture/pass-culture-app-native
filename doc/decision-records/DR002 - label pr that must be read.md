# Title : DR002 - Provide a label on PRs to help understand the codebase or our practices better

> Status : 

## Decision

Add a specific label to new PRs, which must be read by all developers, even those who are not yet here.

The label family starts all bay `good` :

## Context

Developers write code within the context of a feature. This context is not visible when looking at only one file.
So it is invisible or hard to understand for any developer that was not part of the initial work.
Marking PR give the context and why the work was done that way.

## Alternatives considered

Do nothing and rely only on the code and on the reading appetite of other developers

Write ADR

Write documentation on Notion

## Justification

Selecting meeningfull PR is fast. It give the whole context. It can also be upgraded by more text to better understand the context and the decisions.

## Consequences

_Describe the impact of this decision, both positive and negative. Mention the short- and long-term implications._

It takes a bit more time to close this kind of PR.

It forces developers to write down why they do it this way.

It allows to understand  ond change the code meeningfully even after monthes has passed.

## Actions to be implemented

1. Decide if the PR is meeningfull, eventually discuss with the community and the tech lead
2. Choose the appropriate labels starting by `good`
3. Enhance the description to explain context and difficulties
4. Write down an ADR if there is any other important or meeningful decisions

## References

_Include all relevant sources of information (documents, discussions, tickets, etc.)._
