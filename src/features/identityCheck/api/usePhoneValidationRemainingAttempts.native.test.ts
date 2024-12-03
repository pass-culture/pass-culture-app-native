import { PhoneValidationRemainingAttemptsRequest } from 'api/gen'
import { usePhoneValidationRemainingAttempts } from 'features/identityCheck/api/usePhoneValidationRemainingAttempts'
import { phoneValidationRemainingAttemptsFixture } from 'features/identityCheck/fixtures/phoneValidationRemainingAttemptsFixture'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/jwt/jwt')
jest.mock('libs/network/NetInfoWrapper')

describe('usePhoneValidationRemainingAttempts', () => {
  it('calls the API and returns the data and isLastAttempt', async () => {
    mockServer.getApi<PhoneValidationRemainingAttemptsRequest>(
      '/v1/phone_validation/remaining_attempts',
      phoneValidationRemainingAttemptsFixture
    )

    const { result } = renderHook(usePhoneValidationRemainingAttempts, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await act(async () => {})

    expect(result.current.remainingAttempts).toEqual(
      phoneValidationRemainingAttemptsFixture.remainingAttempts
    )
    expect(result.current.counterResetDatetime).toEqual(
      phoneValidationRemainingAttemptsFixture.counterResetDatetime
    )
    expect(result.current.isLastAttempt).toEqual(false)
  })
})
