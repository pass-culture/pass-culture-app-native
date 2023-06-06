import { rest } from 'msw'

import { EmailHistoryEventTypeEnum, EmailUpdateStatus } from 'api/gen'
import { env } from 'libs/environment'
import { eventMonitoring } from 'libs/monitoring'
import { server } from 'tests/server'

import { getEmailUpdateStatus } from './useEmailUpdateStatus'

const emailUpdateStatus: EmailUpdateStatus = {
  expired: false,
  newEmail: 'bene_18x@example.com',
  status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
}

function simulateEmailUpdateStatusError(code: number) {
  server.use(
    rest.get<EmailUpdateStatus>(
      env.API_BASE_URL + '/native/v1/profile/email_update/status',
      (req, res, ctx) => res(ctx.status(code), ctx.json(emailUpdateStatus))
    )
  )
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
