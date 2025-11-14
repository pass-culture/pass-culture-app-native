## Best practices

### Why

- To have a shared understanding of the best practices within the team
- To have a reference for new and existing developers

#### Key points

These rules apply to files that you make changes to.
If you can't respect one of these rules, be sure to explain why with a comment.
If you consider correcting the issue is too time consuming/complex: create a ticket. Link the ticket in the code.

- In the production code: remove type assertions with `as` (type assertions are removed at compile-time, there is no runtime checking associated with a type assertion. There won't be an exception or `null` generated if the type assertion is wrong). In certain cases `as const` is acceptable (for example when defining readonly arrays/objects). Using `as` in tests is tolerable.
- Remove all `@eslint-disable`.
- Remove all warnings, and errors that we are used to ignore (`yarn test:lint`, `yarn test:types`, `yarn start:web`...).
- Don't add new "alias hooks" (hooks created to group other hooks together). When adding new logic, this hook will progressively become more complex and harder to maintain.
- Remove logic from components that should be dumb.
- undefined != null : undefined should be used for optionals and null when no value

#### Request specific:

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

#### Test specific:

- Avoid mocking internal parts of our code. Ideally, mock only external calls.
- When you see a local variable that is over-written in every test, mock it.
- When mocking feature flags, use `setFeatureFlags`. If not possible, mention which one(s) you want to mock in a comment (example: `jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true) // WIP_NEW_OFFER_TILE in renderPassPlaylist.tsx` )
- In component tests, replace `await act(async () => {})` and `await waitFor(/* ... */)` by `await screen.findBySomething()`.
- In hooks tests, use `act` by default and `waitFor` as a last resort.
- Make a snapshot test for pages and modals ONLY.
- Make a web specific snapshot when your web page/modal is specific to the web.
- Make an a11y test for web pages.

#### Advice:

- Use TDD
- Use Storybook
- Use pair programming/mobs

### Mistakes to avoid when following the standard

N/A

### Resources

- See the [DR (Decisions Records)][1] folder on this repo for advanced guidelines
- See the [developement folder][2] on this repo for more advice

[1]: https://github.com/pass-culture/pass-culture-app-native/tree/master/doc/decision-records
[2]: https://github.com/pass-culture/pass-culture-app-native/tree/master/doc/development