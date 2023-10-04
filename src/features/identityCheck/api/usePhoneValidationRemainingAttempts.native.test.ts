import { PhoneValidationRemainingAttemptsRequest } from 'api/gen'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

const phoneValidationRemainingAttemptsAPIResponse: PhoneValidationRemainingAttemptsRequest = {
  remainingAttempts: 5,
  counterResetDatetime: 'time',
}
mockServer.getAPIV1(
  '/native/v1/phone_validation/remaining_attempts',
  phoneValidationRemainingAttemptsAPIResponse
)

describe('usePhoneValidationRemainingAttempts', () => {
  it('calls the API and returns the data and isLastAttempt', async () => {
    const { result } = renderHook(usePhoneValidationRemainingAttempts, {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
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
