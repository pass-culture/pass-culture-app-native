# Testing Strategy

## Why

- Code consistency
- Tests readability

## Key points

- **Full page test**

```jsx
it('should render correctly without login modal', async () => {
   const home = await homeRenderer(false)

   expect(home).toMatchSnapshot()
   home.unmount()
})
```

You should mock SVG & Lottie animations so snapshot can be more lisible

- **Graphics Component test**

❌ No snapshots tests for component. But you can use diff snapshot for complex style checking.
Why pages' snapshots and not components ones ?
If I modify a component, snapshot would for sure be modified.
What I want to know when I modify a component is which pages are impacted. 

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

Test with user interactions

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

- **Navigation test**

```jsx
it('should navigate to the previous when back navigation triggered', () => {
    const { getByTestId } = render(<SetBirthday />)
    const leftIcon = getByTestId('leftIcon')
    fireEvent.press(leftIcon)

    expect(goBack).toBeCalledTimes(1)
})
```

```jsx
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

- **API calls test**

```jsx
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
      await waitFor(() => {
        return result.current.data !== undefined
      })
      expect(result.current.data).toEqual(userProfileAPIResponse)
      expect(userProfileApiMock).toHaveBeenCalledTimes(1)
})
```

## Mistakes to avoid when following the standard

## Ressources
