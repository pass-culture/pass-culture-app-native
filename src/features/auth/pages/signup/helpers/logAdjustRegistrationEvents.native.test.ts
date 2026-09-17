import { logAdjustRegistrationEvents } from 'features/auth/pages/signup/helpers/logAdjustRegistrationEvents'
import { Adjust } from 'libs/adjust/adjust'
import { AdjustEvents } from 'libs/adjust/adjustEvents'
import { storage } from 'libs/storage'

jest.mock('libs/adjust/adjust')

describe('logAdjustRegistrationEvents', () => {
  beforeEach(async () => {
    await storage.clear('adjust_beneficiary_event_sent')
  })

  it('should only log REGISTRATION event when user age is not provided', async () => {
    await logAdjustRegistrationEvents()

    expect(Adjust.logEvent).toHaveBeenNthCalledWith(1, AdjustEvents.REGISTRATION)
  })

  it('should log UNDERAGE_REGISTRATION and REGISTRATION event when user age is less than 18', async () => {
    await logAdjustRegistrationEvents(17)

    expect(Adjust.logEvent).toHaveBeenNthCalledWith(1, AdjustEvents.REGISTRATION)
    expect(Adjust.logEvent).toHaveBeenNthCalledWith(2, AdjustEvents.UNDERAGE_REGISTRATION)
    expect(Adjust.logEvent).toHaveBeenCalledTimes(2)
  })

  it('should log REGISTRATION_18 and REGISTRATION event when user age is 18', async () => {
    await logAdjustRegistrationEvents(18)

    expect(Adjust.logEvent).toHaveBeenNthCalledWith(1, AdjustEvents.REGISTRATION)
    expect(Adjust.logEvent).toHaveBeenNthCalledWith(2, AdjustEvents.REGISTRATION_18)
    expect(Adjust.logEvent).toHaveBeenCalledTimes(2)
  })

  it('should log  REGISTRATION_18 and REGISTRATION event when user age is more than 18', async () => {
    await logAdjustRegistrationEvents(19)

    expect(Adjust.logEvent).toHaveBeenNthCalledWith(1, AdjustEvents.REGISTRATION)
    expect(Adjust.logEvent).toHaveBeenNthCalledWith(2, AdjustEvents.REGISTRATION_18)
    expect(Adjust.logEvent).toHaveBeenCalledTimes(2)
  })

  it('should initialize the beneficiary event marker as false', async () => {
    await logAdjustRegistrationEvents()

    await expect(storage.readObject<boolean>('adjust_beneficiary_event_sent')).resolves.toBe(false)
  })

  it('should not reset an existing beneficiary event marker', async () => {
    await storage.saveObject('adjust_beneficiary_event_sent', true)

    await logAdjustRegistrationEvents()

    await expect(storage.readObject<boolean>('adjust_beneficiary_event_sent')).resolves.toBe(true)
  })
})
