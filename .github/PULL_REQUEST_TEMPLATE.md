Link to JIRA ticket: https://passculture.atlassian.net/browse/PC-XXXXX

## Flakiness

If I had to re-run tests in the CI due to flakiness, I add the incident [on Notion][2]

## Checklist

I have:

- [ ] Made sure my feature is working on web.
- [ ] Made sure my feature is working on mobile (depending on relevance : real or virtual devices)
- [ ] Written **unit tests** native (and web when implementation is different) for my feature.
- [ ] Added a **screenshot** for UI tickets or deleted the screenshot section if no UI change
- [ ] If my PR is a bugfix, I add the link of the "résolution de problème sur le bug" [on Notion][1]
- [ ] I am aware of all the best practices and respected them.

## Screenshots

**delete** _if no UI change_

| Platform         | Mockup/Before | After |
| :--------------- | :-----------: | :---: |
| iOS              |               |       |
| Android          |               |       |
| Phone - Chrome   |               |       |
| Desktop - Chrome |               |       |

[1]: https://www.notion.so/passcultureapp/R-solution-de-probl-mes-sur-les-bugs-5dd6df8f6a754e6887066cf613467d0a
[2]: https://www.notion.so/passcultureapp/cb45383351b44723a6f2d9e1481ad6bb?v=10fe47258701423985aa7d25bb04cfee&pvs=4

## Best Practices

<details>
  <summary>Click to expand</summary>

- Remove non-null assertion operators (just like other type assertions, this doesn’t change the runtime behavior of your code, so it’s important to only use `!` when you know that the value can’t be `null` or `undefined`).

Test specific:

- When you see a local variable that is over-written in every test, mock it.
- Prefer `user` to `fireEvent`.

</details>
