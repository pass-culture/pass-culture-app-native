# Full page test

## Render test

```jsx
import { render, screen } from 'tests/utils'

it('should render correctly', () => {
  render(<Page />)

  expect(screen).toMatchSnapshot()
})
```

If component is using timed function such as animation, snapshot will always differ, it can be worth controlling the time:

```jsx
import { render, screen } from 'tests/utils'

it('should render correctly', async () => {
  jest.useFakeTimers()
  render(<Page />)

  jest.advanceTimersByTime(1000)

  expect(screen).toMatchSnapshot()
  jest.useRealTimers()
})
```

SVG & Lottie animations are mocked so snapshot can be more lisible. You can test their existence / non-existence by making queries on either their testID or the "mocked" text replacing the actual content of the SVGs / animations.

It can happen that the render function is heavy and repeats itself in each test (for example if it uses `reactQueryProviderHOC` and `msw`, or when you need to wrap your component). You can extract this function into the test file but it shouldn't be the default.
It is also important to keep this render function synchronous, asynchronous code should be kept for particular tests.

Example of a complex render function:

```jsx
export const renderOfferBody = (
  additionalProps: {
    sameCategorySimilarOffers?: SearchHit[]
    otherCategoriesSimilarOffers?: SearchHit[]
  } = {}
) =>
  render(
    reactQueryProviderHOC(
      <NetInfoWrapper>
        <OfferBody offerId={offerId} onScroll={onScroll} {...additionalProps} />
      </NetInfoWrapper>
    )
  )
```

---

## Accessibility

Accessibility test should be only on **web** and on **pages** or **modals**

```jsx
import { checkAccessibilityFor, render } from 'tests/utils/web'

describe('<YourPage/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<YourPage />)
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
```

> 💡 It is possible to generate an accessible test model with the snippet (vscode) `a11y-test`

If you want to disable accessibility rules use the `enabled` from `rules` property

> ⚠️ For demonstration only, don't disable rules that need fixing.

```jsx
[...]
      const results = await checkAccessibilityFor(container, {
        rules: {
          'aria-allowed-role': { enabled: false },
        },
      })

      expect(results).toHaveNoViolations()
[...]
```

If you encounter an error with `duplicate-id-aria` this is due to the global uuid mock, we systematically mock `testUuidV4`
To correct this error it is necessary to mock uuid in your test file like this:

```jsx
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})
```

### Exceeded timeout of 15000 ms for a test

If you get failing accessibility tests in the CI with the following message:

```
thrown: "Exceeded timeout of 15000 ms for a test.
Add a timeout value to this test to increase the timeout, if this is a long-running test.
```

A quick fix is to isolate the test in it's own file.

For example, previously inside `Favorites.web.test.tsx` there were 3 different accessibility tests. We separated the tests into 3 different files:

```
- Favorites.accessibility.offline.web.test.tsx
- Favorites.accessibility.loggedIn.web.test.tsx
- Favorites.accessibility.loggedOut.web.test.tsx
```

Then we no longer ran into the "Exceeded timeout" error in the CI.

Accessibility tests are heavy tests and sometimes, in the CI were performances and not the highest, they take extra time to finish, sometimes running into the maximum timeout.

By putting each accessibility test in its own file, each test will have its own timeout counter, thus is less likely to trigger the timeout.

I was able to reproduce CI flakiness locally by:

- Starting all the native unit tests in a terminal: `yarn test:unit -u`
- In another terminal, run several suites of tests: `yarn test:unit:web Venue -u`
- Out of my 5 runs that I attempted for the `Venue` tests, at least 1 test would fail that wouldn't fail otherwise (if all the native unit tests hadn't been running in another terminal).
- But I believe that this reproduction scenario is not ideal because: you can force the tests to fail, but then when separating the accessibility tests in isolated files which fixes CI flakiness, the tests still fail locally under these conditions.
