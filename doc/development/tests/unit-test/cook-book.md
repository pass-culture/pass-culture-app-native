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
import { useAuthContext } from 'features/auth/context/AuthContext'

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

#### Use msw server

When we have to do a request to a server, for example our own API or the recommandation endpoint, we have to use a mocked server in our tests.
For that purpose we use msw, and `mockServer` utils, and 8 possible methods: `getApiV1`, `postApiV1`, `putApiV1`, `deleteApiV1`, `universalGet`, `universalPost`, `universalPut`, `universalDelete`.

They are two types of call: the one to our backend `api/native/v1` and the other ones. We also have two uses of our mocked request : those who responds with a status code 200 and a data (that we use the most) and the one with an error. Here are different example on how to use the mockServer in different use cases.

1. Call to our API with data in response

```
mockServer.getApiV1<UpdateEmailTokenExpiration>('/profile/token_expiration', {
      expiration: undefined,
    })
```

2. Call to our API but we want the response to persist for more than one call (here the data is empty)

```
mockServer.postApiV1('/change_password', {
      responseOptions: { data: {} },
      requestOptions: { persist: true },
    })
```

3. Call to our API but the response is an error

```
mockServer.postApiV1('/profile/update_email', {
    responseOptions: { statusCode: 400, data: { code: 'INVALID_PASSWORD' } },
  })
```

4. Call to another API than our `native/v1` (the url needs to be full)

```
mockServer.universalGet(`https://recommmendation-endpoint/similar_offers/${mockOfferId}`, {
      hits: [],
    })
```
