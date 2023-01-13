# General guidelines

## FIRST principles

- Fast: Could be run anytime during the development phase
- Independant/Isolated: Test should also follow 3A (Arrange, Act, Assert, ou Given-When-Then) and test one functionality
- Repeatable: Each test sould give the same result each time it runs
- Self-validating: The output of a test should be "yes" or "no", and not some values to check
- Thorough: Tests must cover all possibilities and edge cases
- Timely: Test should be written before their feature (TDD)

---

## When to use .web and .native?

use `MyComponent.native.test.tsx` either if

- the logic is shared between web and native
- there is a file `MyComponent.native.tsx.`

use `MyComponent.web.test.tsx` either if

- there is a file `MyComponent.web.tsx`
- the logic and/or design differs from web to native

  - if you used `Platform.OS === web`, `isWeb`
  - if you used `isTouch` or `isNative`
    -> in that case, you should use userEvent instead of fireEvent

use `useSomeHook.test.ts` if there is no render, for example when testing a hook

**Do not use** `MyComponent.test.tsx` without `.web` or `.native`

---

## When to use storybook and snapshots

**Snapshots** are used when testing

- a page
- a modale

**Snapshots** are not used when testing

- a unit component
- a component that is already tested in storybook

**Storybook** is used when testing

- a component that is used multiple times in the app
- a component from the design system
- a component which size differs depending on the device

**Storybook** is not used when testing

- a big and complex component
- a component used in a single page

---

## When to use queryBy, findBy and getBy

- Prove that an element exists with `getBy` + `expect(…).toBeTruthy()`
- Prove that an element does not exist with `queryBy` + `expect(…).toBeNull()`
- Query an element to process some action on it with `getBy` + action
- **Prefer to use** `await findBy`instead of `waitFor(getBy)`or `waitFor(queryBy)` as it is equivalent`,

More details in [react testing library doc](https://testing-library.com/docs/queries/about/#priority)
