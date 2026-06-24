import { AccountState, UserSuspensionStatusResponse } from 'api/gen'
import { accountQueries } from 'features/trustedDevice/queries/useAccountSuspendTokenValidationQuery'
import { queryClient } from 'libs/react-query/queryClient'
import { mockServer } from 'tests/mswServer'

const expectedResponse = { status: AccountState.SUSPENDED }
const simulateSuspensionStatus200 = () => {
  mockServer.getApi<UserSuspensionStatusResponse>('/v1/account/suspension_status', expectedResponse)
}

const simulateSuspensionStatusError = () => {
  mockServer.getApi<UserSuspensionStatusResponse>('/v1/account/suspension_status', {
    responseOptions: { statusCode: 400 },
  })
}
jest.mock('libs/jwt/jwt')

describe('suspension status query', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('should return suspension status if it exists', async () => {
    simulateSuspensionStatus200()
    const response = await queryClient.fetchQuery(accountQueries.suspensionStatus())

    expect(response?.status).toBe(expectedResponse.status)
  })

  it('should return no status for unsuspended user', async () => {
    simulateSuspensionStatusError()
    const response = await queryClient.fetchQuery(accountQueries.suspensionStatus())

    expect(response?.status).toBeUndefined()
  })
})
