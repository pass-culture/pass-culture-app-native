import { logAdjustRegistrationEvents } from 'features/auth/pages/signup/helpers/logAdjustRegistrationEvents'
import { Adjust } from 'libs/adjust/adjust'
import { AdjustEvents, AdjustEventsStorage } from 'libs/adjust/adjustEvents'
import { storage } from 'libs/storage'

jest.mock('libs/adjust/adjust')
const AdjustMock = Adjust as jest.Mocked<typeof Adjust>

let callbackPromise: Promise<void> | undefined

describe('logAdjustRegistrationEvents', () => {
  beforeEach(async () => {
    await storage.clear('adjust_events')

    AdjustMock.isEnabled.mockImplementation((callback) => {
      callbackPromise = (callback as (enabled: boolean) => Promise<void>)(true)
    })
  })

  it('must do nothing if Adjust is not initialized', async () => {
    let callbackPromiseToWait
    AdjustMock.isEnabled.mockImplementationOnce((callback) => {
      callbackPromiseToWait = (callback as (enabled: boolean) => Promise<void>)(false)
    })

    logAdjustRegistrationEvents()

    await callbackPromiseToWait

    expect(Adjust.logEvent).not.toHaveBeenCalled()

    const adjustEventsStorage = await storage.readObject<AdjustEventsStorage>('adjust_events')

    expect(adjustEventsStorage).toBeNull()
  })

  it('should only log REGISTRATION event when user age is not provided', async () => {
    logAdjustRegistrationEvents()

    await callbackPromise

    expect(Adjust.logEvent).toHaveBeenCalledTimes(1)
    expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.REGISTRATION)
  })

  it.each([15, 16, 17])(
    'should only log UNDERAGE_REGISTRATION, REGISTRATION and REGISTRATION_1518 events when user age is %i',
    async (age) => {
      logAdjustRegistrationEvents(age)

      await callbackPromise

      expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.REGISTRATION)
      expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.UNDERAGE_REGISTRATION)
      expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.REGISTRATION_1518)
      expect(Adjust.logEvent).toHaveBeenCalledTimes(3)
    }
  )

  it('should only log REGISTRATION_18, REGISTRATION_1518 and REGISTRATION event when user age is 18', async () => {
    logAdjustRegistrationEvents(18)

    await callbackPromise

    expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.REGISTRATION)
    expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.REGISTRATION_1518)
    expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.REGISTRATION_18)
    expect(Adjust.logEvent).toHaveBeenCalledTimes(3)
  })

  it('should only log REGISTRATION event when user age is more than 18', async () => {
    logAdjustRegistrationEvents(19)

    await callbackPromise

    expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.REGISTRATION)
    expect(Adjust.logEvent).toHaveBeenCalledTimes(1)
  })

  it('should set adjustRegistrationEventAlreadySent to true in storage without reset other stored data', async () => {
    await storage.saveObject('adjust_events', {
      adjustBeneficiaryEventAlreadySent: true,
    })

    logAdjustRegistrationEvents()

    await callbackPromise

    const adjustEventsStorage = await storage.readObject<AdjustEventsStorage>('adjust_events')

    expect(adjustEventsStorage?.adjustBeneficiaryEventAlreadySent).toBe(true)
    expect(adjustEventsStorage?.adjustRegistrationEventAlreadySent).toBe(true)
  })
})
