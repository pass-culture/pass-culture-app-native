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

These rules apply to files that you make changes to.
If you can't respect one of these rules, be sure to explain why with a comment.
If you consider correcting the issue is too time consuming/complex: create a ticket. Link the ticket in the code.

- In the production code: remove type assertions with `as` (type assertions are removed at compile-time, there is no runtime checking associated with a type assertion. There won’t be an exception or `null` generated if the type assertion is wrong). In certain cases `as const` is acceptable (for example when defining readonly arrays/objects). Using `as` in tests is tolerable.
- Remove bypass type checking with `any` (when you want to accept anything because you will be blindly passing it through without interacting with it, you can use `unknown`). Using `any` in tests is tolerable.
- Remove non-null assertion operators (just like other type assertions, this doesn’t change the runtime behavior of your code, so it’s important to only use `!` when you know that the value can’t be `null` or `undefined`).
- Remove all `@ts-expect-error` and `@eslint-disable`.
- Remove all warnings, and errors that we are used to ignore (`yarn test:lint`, `yarn test:types`, `yarn start:web`...).
- Use `gap` (`ViewGap`) instead of `<Spacer.Column />`, `<Spacer.Row />` or `<Spacer.Flex />`.
- Don't add new "alias hooks" (hooks created to group other hooks together). When adding new logic, this hook will progressively become more complex and harder to maintain.
- Remove logic from components that should be dumb.
- undefined != null : undefined should be used for optionals and null when no value

### Request specific:

- A request must use `react-query`
- A hook that use `react-query` must:
  - folder
    - when used in one feature
      - be in `src/<feature>/queries/`
    - when used by several features
      - be in `src/queries/<the main feature related to the query>/`
  - file
    - when use `useQuery` or hook related (like `useInfiniteQuery`)
      - named `use<the content retrieved by the query>Query.ts`
      - returns the type `UseQueryResult<the content retrieved by the query>`
    - when use `useMutation`
      - named `use<the content mutated by the query>Mutation.ts`
      - returns the type `UseMutationResult<the content mutated by the query>`

### Test specific:

- Avoid mocking internal parts of our code. Ideally, mock only external calls.
- When you see a local variable that is over-written in every test, mock it.
- Prefer `user` to `fireEvent`.
- When mocking feature flags, use `setFeatureFlags`. If not possible, mention which one(s) you want to mock in a comment (example: `jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true) // WIP_NEW_OFFER_TILE in renderPassPlaylist.tsx` )
- In component tests, replace `await act(async () => {})` and `await waitFor(/* ... */)` by `await screen.findBySomething()`.
- In hooks tests, use `act` by default and `waitFor` as a last resort.
- Make a snapshot test for pages and modals ONLY.
- Make a web specific snapshot when your web page/modal is specific to the web.
- Make an a11y test for web pages.

### Advice:

- Use TDD
- Use Storybook
- Use pair programming/mobs

</details>
