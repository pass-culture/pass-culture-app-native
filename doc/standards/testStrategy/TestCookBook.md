# Tests cook book

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
mockUseAuthContext.mockReturnValueOnce({
  isLoggedIn,
  setIsLoggedIn: jest.fn(),
  user: anUserFixtures,
  refetchUser: jest.fn(),
  isUserLoading: false,
})
```

#### Mock route params

When the tested component use route params through `useRoute` hook, `params` can be mocked as follows:

```tsx
import { useRoute } from '__mocks__/@react-navigation/native'

// later
useRoute.mockReturnValue({
  params: {
    shouldDisplayLoginModal: withModal,
  },
})
```
