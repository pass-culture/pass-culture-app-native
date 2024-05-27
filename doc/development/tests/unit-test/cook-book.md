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

When a component uses AuthContext, you first need to mock it at the top of the file:

```ts
import { useAuthContext } from 'features/auth/context/AuthContext'

jest.mock('features/auth/context/AuthContext')
```

Then you can use 2 different utils depending on your need.

If you want a disconnected user:

```ts
mockAuthContextWithoutUser()
```

If you want a logged in specific user:

```ts
mockAuthContextWithUser(anUserFixture)
```

If you want to persist your mock (using `mockReturnValue` instead of `mockReturnValueOnce`) you can pass the persist option as follows:

```ts
mockAuthContextWithoutUser({ persist: true })
mockAuthContextWithUser(anUserFixture, { persist: true })
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
