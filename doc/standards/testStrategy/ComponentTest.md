# Component test

Do not test component with snapshots

## Navigation Test

Some examples

```jsx
it('should navigate to the previous when back navigation triggered', () => {
  const { getByTestId } = render(<SetBirthday />)
  const leftIcon = getByTestId('leftIcon')
  fireEvent.press(leftIcon)

  expect(goBack).toHaveBeenCalledTimes(1)
})
```

```jsx
it('should redirect to home page when signin is successful', async () => {
  const { findByText } = render(<Login />)
  mockSignIn.mockReturnValueOnce(true)

  const connexionButton = await findByText('Se connecter')
  fireEvent.press(connexionButton)

  await waitFor(() => {
    expect(navigate).toHaveBeenCalledTimes(1)
  })
})
```

---

## Test the responsibility of the components

Ideally, you want to make sure that the tests for a component only test that which is the responsibility of the component. There are several reasons for this:

- With jest, we test our components in a unitary way, so they must be separated from the rest of the code
- If a component is used in several places and its behavior is tested each time, we have unnecessary duplicates and this creates a waste of time, both in writing these tests and in launching them

How to do it?

- When a component is created to be used in several places and when it contains logic, it is better to test it in its own file, and (when necessary) mock it in the files where it is called
- When refactoring, when you extract a component to put it in its own file, it is better to accompany it with its own test file to test its own responsibility

---

## How to use act(...)

Overall, you should try to use it as little as possible because it often hides important information, like promise resolutions.

You should definitely not use it around a fireEvent or render because it's useless, they are already wrapped in their operation.

We can use it to test our hooks

```jsx
const { result } = renderHook(() => useCount())

act(() => result.current.incrementCount())

expect(result.current.count).toBe(1)
```

It can be used when using fake timers

More details on the use of act [here](https://www.notion.so/passcultureapp/Comment-retirer-les-erreurs-act-de-nos-tests-150b31296d4d4770a74b4f9f340402fd)
