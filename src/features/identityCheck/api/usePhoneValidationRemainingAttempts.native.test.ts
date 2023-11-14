import { PhoneValidationRemainingAttemptsRequest } from 'api/gen'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

const phoneValidationRemainingAttemptsAPIResponse: PhoneValidationRemainingAttemptsRequest = {
  remainingAttempts: 5,
  counterResetDatetime: 'time',
}

describe('usePhoneValidationRemainingAttempts', () => {
  it('calls the API and returns the data and isLastAttempt', async () => {
    mockServer.getApiV1(
      '/phone_validation/remaining_attempts',
      phoneValidationRemainingAttemptsAPIResponse
    )

    const { result } = renderHook(usePhoneValidationRemainingAttempts, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(result.current.remainingAttempts).toEqual(
      phoneValidationRemainingAttemptsAPIResponse.remainingAttempts
    )
    expect(result.current.counterResetDatetime).toEqual(
      phoneValidationRemainingAttemptsAPIResponse.counterResetDatetime
    )
    expect(result.current.isLastAttempt).toEqual(false)
  })
})
