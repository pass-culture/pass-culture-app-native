# Full page test

## Render test

```jsx
it('should render correctly', async () => {
  const page = await render(<Page />)

  expect(page).toMatchSnapshot()
})
```

If component is using timed function such as animation, snapshot will always differ, it can be worth controlling the time:

```jsx
it('should render correctly', async () => {
  jest.useFakeTimers()
  const page = render(<Page />)

  jest.advanceTimersByTime(1000)

  expect(page).toMatchSnapshot()
  jest.useRealTimers()
})
```

SVG & Lottie animations are mocked so snapshot can be more lisible. You can test their existence / non-existence by making queries on either their testID or the "mocked" text replacing the actual content of the SVGs / animations.

---

## Accessibility

Accessibility test should be only on **web** and on **pages** or **modals**

```jsx
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
To correct this error it is necessary to mock uuid in your test file like this :

```jsx
const mockV4 = jest.fn()
jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(mockV4),
}))
```

And use `mockV4.mockReturnValueOnce('yourId')` for each uuid needed.
