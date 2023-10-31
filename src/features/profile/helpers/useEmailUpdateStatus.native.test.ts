import { EmailHistoryEventTypeEnum, EmailUpdateStatus } from 'api/gen'
import { eventMonitoring } from 'libs/monitoring'
import { mockServer } from 'tests/mswServer'

import { getEmailUpdateStatus } from './useEmailUpdateStatus'

const emailUpdateStatus: EmailUpdateStatus = {
  expired: false,
  newEmail: 'bene_18x@example.com',
  status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
}

function simulateEmailUpdateStatusError(code: number) {
  mockServer.getApiV1<EmailUpdateStatus>('/profile/email_update/status', {
    responseOptions: { statusCode: code, data: emailUpdateStatus },
  })
}

describe('getEmailUpdateStatus', () => {
  it('should capture a Sentry exception when error code is 422 and return undefined', async () => {
    simulateEmailUpdateStatusError(422)
    const emailUpdateStatus = await getEmailUpdateStatus()

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
    'should capture a Sentry exception when error code is %s and return undefined',
    async (statusCode) => {
      simulateEmailUpdateStatusError(statusCode)
      const emailUpdateStatus = await getEmailUpdateStatus()

      expect(eventMonitoring.captureException).not.toHaveBeenCalled()
      expect(emailUpdateStatus).toEqual(undefined)
    }
  )

  it.each([
    401, // Unauthorized
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ])(
    'should capture a Sentry info when error code is %s and return undefined',
    async (statusCode) => {
      simulateEmailUpdateStatusError(statusCode)
      const emailUpdateStatus = await getEmailUpdateStatus()

      expect(eventMonitoring.captureMessage).toHaveBeenCalledTimes(1)
      expect(emailUpdateStatus).toEqual(undefined)
    }
  )
})
