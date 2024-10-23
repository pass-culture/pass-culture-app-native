# Component test

Do not test component with snapshots

## Navigation Test

Some examples

```jsx
import { render, screen } from 'tests/utils'

jest.useFakeTimers()
it('should navigate to the previous when back navigation triggered', () => {
  render(<SetBirthday />)

  const leftIcon = screen.getByLabelText('Revenir en arrière')
  const user = userEvent.setup()
  await user.press(leftIcon)

  expect(goBack).toHaveBeenCalledTimes(1)
})
```

```jsx
import { render, screen } from 'tests/utils'

jest.useFakeTimers()
it('should redirect to home page when signin is successful', async () => {
  render(<Login />)
  mockSignIn.mockReturnValueOnce(true)

  const connexionButton = await screen.findByText('Se connecter')
  const user = userEvent.setup()
  await user.press(connexionButton)

  expect(navigate).toHaveBeenCalledTimes(1)
})
```

---

## Test the responsibility of the components

Ideally, you want to make sure to only test the responsibility of the component and not the one of the components it calls. There are several reasons for this:

- With jest, we test our components in a unitary way, so they must be separated from the rest of the code
- If a component is used in several places and its behavior is tested each time, we have unnecessary duplicates and this creates a waste of time, both in writing these tests and in launching them

How to do it?

- When a component is created to be used in several places and when it contains logic, it is better to test it in its own file, and (when necessary) mock it in the files where it is called
- When refactoring, when you extract a component to put it in its own file, it is better to accompany it with its own test file to test its own responsibility
