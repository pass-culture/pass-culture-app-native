import { UserSuspensionDateResponse } from 'api/gen'
import { accountQueries } from 'features/trustedDevice/queries/useAccountSuspendTokenValidationQuery'
import { queryClient } from 'libs/react-query/queryClient'
import { mockServer } from 'tests/mswServer'

jest.mock('libs/jwt/jwt')

const expectedResponse = { date: '2022-05-11T10:29:25.332786Z' }
function simulateSuspensionDate200() {
  mockServer.getApi<UserSuspensionDateResponse>('/v1/account/suspension_date', expectedResponse)
}

function simulateSuspensionDateActiveAccount() {
  mockServer.getApi<UserSuspensionDateResponse>('/v1/account/suspension_date', {
    responseOptions: { statusCode: 403 },
  })
}

describe('suspension date query', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('should return suspension date if it exists', async () => {
    simulateSuspensionDate200()
    const response = await queryClient.fetchQuery(accountQueries.suspensionDate())

    expect(response?.date).toBe(expectedResponse.date)
  })

  it('should return no date for unsuspended user', async () => {
    simulateSuspensionDateActiveAccount()
    const response = await queryClient.fetchQuery(accountQueries.suspensionDate())

    expect(response?.date).toBeUndefined()
  })
})
