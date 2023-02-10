import { rest } from 'msw'

import { PhoneValidationRemainingAttemptsRequest } from 'api/gen'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

const phoneValidationApiMock = jest.fn()
const phoneValidationRemainingAttemptsAPIResponse: PhoneValidationRemainingAttemptsRequest = {
  remainingAttempts: 5,
  counterResetDatetime: 'time',
}

server.use(
  rest.get(env.API_BASE_URL + '/native/v1/phone_validation/remaining_attempts', (req, res, ctx) => {
    phoneValidationApiMock()
    return res(ctx.status(200), ctx.json(phoneValidationRemainingAttemptsAPIResponse))
  })
)

describe('usePhoneValidationRemainingAttempts', () => {
  it('calls the API and returns the data and isLastAttempt', async () => {
    const { result } = renderHook(usePhoneValidationRemainingAttempts, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current.remainingAttempts).toEqual(
        phoneValidationRemainingAttemptsAPIResponse.remainingAttempts
      )
      expect(result.current.counterResetDatetime).toEqual(
        phoneValidationRemainingAttemptsAPIResponse.counterResetDatetime
      )
      expect(result.current.isLastAttempt).toEqual(false)
      expect(phoneValidationApiMock).toHaveBeenCalledTimes(1)
    })
  })
})
