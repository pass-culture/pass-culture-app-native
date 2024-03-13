# Tests cook book

## Date

> We use `TZ=UTC` environment variable so every serialized date are in UTC to prevent environment conflict.

You can mock the result of `new Date()` as follows:

```ts
const Today = new Date(2020, 10, 1)

describe('Favorites reducer', () => {
  beforeAll(() => {
    mockdate.set(Today)
  })
})
```

## Authentication with `authContext`

To test as an authenticated person, you can mock `useAuthContext` as follows:

```ts
import { useAuthContext } from 'features/auth/context/AuthContext'

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

// ... and then within each test
mockUseAuthContext.mockReturnValueOnce({
  isLoggedIn,
  setIsLoggedIn: jest.fn(),
  user: anUserFixtures,
  refetchUser: jest.fn(),
  isUserLoading: false,
})
```

## Mock route params

When the tested component use route params through `useRoute` hook, `params` can be mocked as follows:

```ts
import { useRoute } from '__mocks__/@react-navigation/native'

// later
useRoute.mockReturnValue({
  params: {
    shouldDisplayLoginModal: withModal,
  },
})
```

## Test that the user sees a snackbar

1. Mock the snackbar context at the beginning of the file

```ts
const mockShowErrorSnackBar = jest.fn()
const mockShowInfoSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackBar,
    showInfoSnackBar: mockShowInfoSnackBar,
  }),
}))
```

2. In your test, assert that the mock has been called with the message that is supposed to be displayed in the snackBar, and with the correct timeout.

```ts
expect(mockShowErrorSnackBar).toHaveBeenCalledWith({
  message:
    'Ton compte Google semble ne pas être valide. Pour pouvoir te connecter, confirme d’abord ton adresse e-mail Google.',
  timeout: SNACK_BAR_TIME_OUT_LONG,
})
```
