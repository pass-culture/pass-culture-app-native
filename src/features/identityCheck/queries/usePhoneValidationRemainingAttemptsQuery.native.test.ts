import { PhoneValidationRemainingAttemptsRequest } from 'api/gen'
import { phoneValidationRemainingAttemptsFixture } from 'features/identityCheck/fixtures/phoneValidationRemainingAttemptsFixture'
import { usePhoneValidationRemainingAttemptsQuery } from 'features/identityCheck/queries/usePhoneValidationRemainingAttemptsQuery'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/jwt/jwt')

describe('usePhoneValidationRemainingAttempts', () => {
  //TODO(PC-36587): unskip this test
  it.skip('calls the API and returns the data and isLastAttempt', async () => {
    mockServer.getApi<PhoneValidationRemainingAttemptsRequest>(
      '/v1/phone_validation/remaining_attempts',
      phoneValidationRemainingAttemptsFixture
    )

    const { result } = renderHook(usePhoneValidationRemainingAttemptsQuery, {
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
