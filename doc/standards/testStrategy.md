## Testing Strategy

Why ?

- Code consistency
- Tests readability

### Key points

- **Full page test**

```jsx
it('should render correctly without login modal', async () => {
  const home = await homeRenderer(false)

  expect(home).toMatchSnapshot()
  home.unmount()
})
```

If component is using timed function such as animation, snapshot will always differ, it can be worth controlling the time:

```tsx
it('should render privacy policy', async () => {
  jest.useFakeTimers()
  const renderAPI = render(<PrivacyPolicy />)
  await act(flushAllPromises)

  jest.advanceTimersByTime(1000)

  expect(renderAPI).toMatchSnapshot()
  jest.useRealTimers()
})
```

> SVG & Lottie animations are mocked so snapshot can be more lisible.
> You can test their existence / non-existence by making queries on either their `testID` or the "mocked" text replacing the actual content of the SVGs / animations.

- **Graphics Component test**

We do not allow snapshots tests for component, you can still use diff snapshot for complex style checking.

- Why pages' snapshots and not components ones ?

You may not anticipate changes to all screens of the app when you make changes to a component. In such a case, a snapshot failing would be a warning to you : does this screen still displays correctly ?
Think of it as a poor man's visual testing.

```jsx
it('should render modal correctly', async () => {
  const homeWithLoginModal = await homeRenderer(true)
  const homeWithoutLoginModal = await homeRenderer(false)

  expect(homeWithoutLoginModal).toMatchDiffSnapshot(homeWithLoginModal)
  homeWithLoginModal.unmount()
  homeWithoutLoginModal.unmount()
})
```

```jsx
it('should be hidden when the icon is not provided', () => {
  const { getByTestId } = render(<ModalHeader title="Testing modal header rendering" />)
  const rightIcon = queryByTestId('rightIcon')
  expect(rightIcon).toBeFalsy()
})
```

- **Test with user interactions**

```jsx
it('should display the error message when the date is not correct', () => {
  const { getByText, getByPlaceholderText } = render(<SetBirthday />)

  const day = getByPlaceholderText('JJ')
  const month = getByPlaceholderText('MM')
  const year = getByPlaceholderText('YYYY')

  fireEvent.changeText(day, '29')
  fireEvent.changeText(month, '02')
  fireEvent.changeText(year, '2005')

  const continueButton = getByText('Continuer')
  fireEvent.press(continueButton)

  getByText('La date choisie est incorrecte')
})
```

### renderAPI

When calling `render`, you will get a `renderAPI` object

### Avoid `console` within tests

These are tips to avoid `console` within your tests.

- Use `queryBy` methods to test the inexistence of an element.
- Use `getBy` methods when you know it's truthy
- To avoid `act` warnings:
  - try to add `await superFlushWithAct()`, and pass a `number` greater than `10` _(default)_ to flush more promises
  - try to use `waitForExpect` each time you anticipate expectations that should be made after the execution of asynchrone actions.
- To test an expected error, clean it from your test (we already have the test description):
  - Use `jest.spyOn(global.console, 'error').mockImplementationOnce(() => null)` before each test

If none of those methods works, and your test still fail:

- ask other developers for help you resolve `console` within your tests
- if agreed, use at the top of your test `allowConsole({ error: true })`,
  this will pollute the test log output, but it will pass (aka volkswagen)

### Test cook book

#### Date

> We use `TZ=UTC` environment variable so every serialized date are in UTC to prevent environment conflict.

You can mock the result of `new Date()` as follows:

```tsx
const Today = new Date(2020, 10, 1)

describe('Favorites reducer', () => {
  beforeAll(() => {
    mockdate.set(Today)
  })
})
```

#### Authentication with `authContext`

To test as an authenticated person, you can mock `useAuthContext` as follows:

```tsx
import { useAuthContext } from 'features/auth/AuthContext'
jest.mock('features/auth/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
// ... and then within each test
mockUseAuthContext.mockReturnValue({ isLoggedIn, setIsLoggedIn: jest.fn() })
```

Don't forget to use `afterEach(jest.clearAllMocks)` to clear mocks after each test.

#### Navigation

To test our `navigate` call, we can do:

```tsx
it('should navigate to the previous when back navigation triggered', () => {
  const { getByTestId } = render(<SetBirthday />)
  fireEvent.press(getByTestId('leftIcon'))

  expect(goBack).toBeCalledTimes(1)
})
```

If `act` warnings appear, try to use `await superFlushWithAct(times)` or wrap the `expect` around `waitForExpect`:

```tsx
it('should redirect to home page WHEN signin is successful', async () => {
  const { findByText } = renderLogin()
  mockSignIn.mockImplementationOnce(() => true)

  const connexionButton = await findByText('Se connecter')
  fireEvent.press(connexionButton)

  await waitForExpect(() => {
    expect(mockSignIn).toBeCalledTimes(1)
    expect(navigate).toBeCalledTimes(1)
  })
})
```

#### Mock route params

When the tested component use route params through `useRoute` hook, `params` can be mocked like follow:

```tsx
import { useRoute } from '__mocks__/@react-navigation/native'

// later
useRoute.mockReturnValue({
  params: {
    shouldDisplayLoginModal: withModal,
  },
})
```

#### React Query and API calls

We use the test utility `reactQueryProviderHOC` to bring react-query context within a test, use it around your rendered element:

```tsx
render(reactQueryProviderHOC(<FooComponent />))
```

Now that you have the [`react-query`](https://react-query.tanstack.com/) context, you need to mock the backend http responses, you can use [`msw`](https://github.com/mswjs/msw):

```tsx
import { server } from 'tests/server'

server.use(
  rest.get(env.API_BASE_URL + '/native/v1/me', (req, res, ctx) => {
    userProfileApiMock()
    return res(ctx.status(200), ctx.json(userProfileAPIResponse))
  })
)

it('calls the API and returns the data', async () => {
  const { result, waitFor } = renderHook(useUserProfileInfo, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
  await waitFor(() => result.current.data !== undefined)
  expect(result.current.data).toEqual(userProfileAPIResponse)
  expect(userProfileApiMock).toHaveBeenCalledTimes(1)
})
```

### Mistakes to avoid when following the standard

### Ressources
