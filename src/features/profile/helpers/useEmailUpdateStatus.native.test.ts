import { EmailHistoryEventTypeEnum, EmailUpdateStatus } from 'api/gen'
import { eventMonitoring } from 'libs/monitoring'
import { LogTypeEnum } from 'libs/monitoring/errors'
import { mockServer } from 'tests/mswServer'

import { getEmailUpdateStatus } from './useEmailUpdateStatus'

jest.mock('libs/monitoring')
jest.mock('libs/jwt/jwt')

const emailUpdateStatus: EmailUpdateStatus = {
  expired: false,
  newEmail: 'bene_18x@example.com',
  status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
}

function simulateEmailUpdateStatusError(code: number) {
  mockServer.getApi<EmailUpdateStatus>('/v1/profile/email_update/status', {
    responseOptions: { statusCode: code, data: emailUpdateStatus },
  })
}

jest.mock('libs/firebase/analytics/analytics')

describe('getEmailUpdateStatus', () => {
  it('should capture a Sentry exception when error code is 422 and return undefined', async () => {
    simulateEmailUpdateStatusError(422)
    const emailUpdateStatus = await getEmailUpdateStatus({ logType: LogTypeEnum.IGNORED })

    expect(eventMonitoring.captureException).toHaveBeenCalledTimes(1)
    expect(emailUpdateStatus).toEqual(undefined)
  })

  it.each([
    401, // Unauthorized
    404, // Not Found
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ])(
    'should not capture a Sentry exception when error code is %s and log type is ignored and return undefined',
    async (statusCode) => {
      simulateEmailUpdateStatusError(statusCode)
      const emailUpdateStatus = await getEmailUpdateStatus({ logType: LogTypeEnum.IGNORED })

      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(0)
      expect(emailUpdateStatus).toEqual(undefined)
    }
  )

  it('should capture a Sentry info and return undefined when error code is 401 and log type from remote config is info', async () => {
    simulateEmailUpdateStatusError(401)
    const emailUpdateStatus = await getEmailUpdateStatus({ logType: LogTypeEnum.INFO })

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(
      `Échec de la requête https://localhost/native/v1/profile/email_update/status, code: 401`,
      { level: 'info' }
    )
    expect(emailUpdateStatus).toEqual(undefined)
  })

  it('should not capture a Sentry info and return undefined when error code is 401 and log type from remote config is ignored', async () => {
    simulateEmailUpdateStatusError(401)
    const emailUpdateStatus = await getEmailUpdateStatus({ logType: LogTypeEnum.IGNORED })

    expect(eventMonitoring.captureException).toHaveBeenCalledTimes(0)
    expect(emailUpdateStatus).toEqual(undefined)
  })

  it.each([
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ])(
    'should not capture a Sentry info when error code is %s and log type is ignored and return undefined',
    async (statusCode) => {
      simulateEmailUpdateStatusError(statusCode)
      const emailUpdateStatus = await getEmailUpdateStatus({ logType: LogTypeEnum.IGNORED })

      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(0)
      expect(emailUpdateStatus).toEqual(undefined)
    }
  )
})
