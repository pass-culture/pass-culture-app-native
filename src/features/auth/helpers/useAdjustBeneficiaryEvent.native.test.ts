import { format } from 'date-fns'
import mockdate from 'mockdate'

import { CURRENT_DATE, SIXTEEN_AGE_DATE, EIGHTEEN_AGE_DATE } from 'features/auth/fixtures/fixtures'
import { UserCreditType } from 'features/auth/helpers/getCreditType'
import { logAdjustBeneficiaryEvent } from 'features/auth/helpers/useAdjustBeneficiaryEvent'
import { beneficiaryUserV2, nonBeneficiaryUserV2 } from 'fixtures/user'
import { Adjust } from 'libs/adjust/adjust'
import { storage } from 'libs/storage'
import { AdjustEvents, AdjustEventsStorage } from 'shared/adjust/adjustEvents'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/adjust/adjust')
const AdjustMock = Adjust as jest.Mocked<typeof Adjust>

let callbackPromise: Promise<void> | undefined

mockdate.set(CURRENT_DATE)

describe('useAdjustBeneficiaryEvent', () => {
  beforeEach(async () => {
    await storage.clear('adjust_events')

    AdjustMock.isEnabled.mockImplementation((callback) => {
      callbackPromise = (callback as (enabled: boolean) => Promise<void>)(true)
    })
  })

  describe('no user', () => {
    it('must do nothing when the user is undefined', async () => {
      logAdjustBeneficiaryEvent(undefined)

      await callbackPromise

      expect(Adjust.logEvent).not.toHaveBeenCalled()

      const adjustEventsStorage = await storage.readObject<AdjustEventsStorage>('adjust_events')

      expect(adjustEventsStorage).toBeNull()
    })
  })

  describe('not beneficiary user', () => {
    it('must do nothing if Adjust is not initialized when user is not beneficiary', async () => {
      let callbackPromiseToWait
      AdjustMock.isEnabled.mockImplementationOnce((callback) => {
        callbackPromiseToWait = (callback as (enabled: boolean) => Promise<void>)(false)
      })

      logAdjustBeneficiaryEvent(nonBeneficiaryUserV2)

      await callbackPromiseToWait

      expect(Adjust.logEvent).not.toHaveBeenCalled()

      const adjustEventsStorage = await storage.readObject<AdjustEventsStorage>('adjust_events')

      expect(adjustEventsStorage).toBeNull()
    })

    it('should set alreadySeenAsNotBeneficiary to true in storage without reset other stored data when user is not beneficiary', async () => {
      await storage.saveObject('adjust_events', {
        adjustRegistrationEventAlreadySent: true,
      })

      logAdjustBeneficiaryEvent(nonBeneficiaryUserV2)

      await callbackPromise

      const adjustEventsStorage = await storage.readObject<AdjustEventsStorage>('adjust_events')

      expect(adjustEventsStorage?.alreadySeenAsNotBeneficiary).toBe(true)
      expect(adjustEventsStorage?.adjustRegistrationEventAlreadySent).toBe(true)
    })

    it('should not log beneficiary event and not set adjustBeneficiaryEventAlreadySent in storage when user is not beneficiary', async () => {
      logAdjustBeneficiaryEvent(nonBeneficiaryUserV2)

      await callbackPromise

      expect(Adjust.logEvent).not.toHaveBeenCalled()

      const adjustEventsStorage = await storage.readObject<AdjustEventsStorage>('adjust_events')

      expect(adjustEventsStorage?.adjustBeneficiaryEventAlreadySent).toBeUndefined()
    })
  })

  describe('beneficiary user', () => {
    it('must do nothing if Adjust is not initialized when user is beneficiary', async () => {
      let callbackPromiseToWait
      AdjustMock.isEnabled.mockImplementationOnce((callback) => {
        callbackPromiseToWait = (callback as (enabled: boolean) => Promise<void>)(false)
      })

      logAdjustBeneficiaryEvent(beneficiaryUserV2)

      await callbackPromiseToWait

      expect(Adjust.logEvent).not.toHaveBeenCalled()

      const adjustEventsStorage = await storage.readObject<AdjustEventsStorage>('adjust_events')

      expect(adjustEventsStorage).toBeNull()
    })

    it('should set adjustBeneficiaryEventAlreadySent to true in storage without reset other stored data when user is beneficiary', async () => {
      await storage.saveObject('adjust_events', {
        adjustRegistrationEventAlreadySent: true,
      })

      logAdjustBeneficiaryEvent(beneficiaryUserV2)

      await callbackPromise

      const adjustEventsStorage = await storage.readObject<AdjustEventsStorage>('adjust_events')

      expect(adjustEventsStorage?.adjustBeneficiaryEventAlreadySent).toBe(true)
      expect(adjustEventsStorage?.adjustRegistrationEventAlreadySent).toBe(true)
    })

    it('should not try to log beneficiary events twice', async () => {
      logAdjustBeneficiaryEvent(beneficiaryUserV2)

      await callbackPromise

      expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.COMPLETE_BENEFICIARY)

      jest.clearAllMocks()

      logAdjustBeneficiaryEvent(beneficiaryUserV2)

      await callbackPromise

      expect(Adjust.logEvent).not.toHaveBeenCalled()
    })

    describe('COMPLETE_BENEFICIARY event', () => {
      it('should only log COMPLETE_BENEFICIARY and COMPLETE_BENEFICIARY_UNDERAGE event when user is beneficiary and is underage', async () => {
        logAdjustBeneficiaryEvent({
          ...beneficiaryUserV2,
          birthDate: format(SIXTEEN_AGE_DATE, 'yyyy-MM-dd'),
        })

        await callbackPromise

        expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.COMPLETE_BENEFICIARY)
        expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.COMPLETE_BENEFICIARY_UNDERAGE)
        expect(Adjust.logEvent).not.toHaveBeenCalledWith(AdjustEvents.COMPLETE_BENEFICIARY_18)
      })

      it('should only log COMPLETE_BENEFICIARY and COMPLETE_BENEFICIARY_18 event when user is beneficiary and is 18 or older', async () => {
        logAdjustBeneficiaryEvent({
          ...beneficiaryUserV2,
          birthDate: format(EIGHTEEN_AGE_DATE, 'yyyy-MM-dd'),
        })

        await callbackPromise

        expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.COMPLETE_BENEFICIARY)
        expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.COMPLETE_BENEFICIARY_18)
        expect(Adjust.logEvent).not.toHaveBeenCalledWith(AdjustEvents.COMPLETE_BENEFICIARY_UNDERAGE)
      })
    })

    describe('NEW_BENEFICIARY_WITH_REGISTRATION event', () => {
      it('should not log NEW_BENEFICIARY_WITH_REGISTRATION event when not adjustRegistrationEventAlreadySent', async () => {
        logAdjustBeneficiaryEvent(beneficiaryUserV2)

        await callbackPromise

        expect(Adjust.logEvent).not.toHaveBeenCalledWith(
          AdjustEvents.NEW_BENEFICIARY_WITH_REGISTRATION
        )
      })

      it('should log NEW_BENEFICIARY_WITH_REGISTRATION event when adjustRegistrationEventAlreadySent', async () => {
        await storage.saveObject('adjust_events', {
          adjustRegistrationEventAlreadySent: true,
        })

        logAdjustBeneficiaryEvent(beneficiaryUserV2)

        await callbackPromise

        expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.NEW_BENEFICIARY_WITH_REGISTRATION)
      })
    })

    describe('NEW_BENEFICIARY event', () => {
      it('should not log NEW_BENEFICIARY event if user is not new beneficiary', async () => {
        logAdjustBeneficiaryEvent(beneficiaryUserV2)

        await callbackPromise

        expect(Adjust.logEvent).not.toHaveBeenCalledWith(AdjustEvents.NEW_BENEFICIARY)
      })

      it('should only log NEW_BENEFICIARY and NEW_FREE_BENEFICIARY event when user is new beneficiary with free credit', async () => {
        await storage.saveObject('adjust_events', {
          alreadySeenAsNotBeneficiary: true,
        })

        logAdjustBeneficiaryEvent({
          ...beneficiaryUserV2,
          creditType: UserCreditType.CREDIT_V3_FREE,
        })

        await callbackPromise

        expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.NEW_BENEFICIARY)
        expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.NEW_FREE_BENEFICIARY)
        expect(Adjust.logEvent).not.toHaveBeenCalledWith(AdjustEvents.NEW_BENEFICIARY_17)
        expect(Adjust.logEvent).not.toHaveBeenCalledWith(AdjustEvents.NEW_BENEFICIARY_18)
      })

      it('should only log NEW_BENEFICIARY and NEW_BENEFICIARY_17 event when user is new beneficiary with credit v3 17', async () => {
        await storage.saveObject('adjust_events', {
          alreadySeenAsNotBeneficiary: true,
        })

        logAdjustBeneficiaryEvent({
          ...beneficiaryUserV2,
          creditType: UserCreditType.CREDIT_V3_17,
        })

        await callbackPromise

        expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.NEW_BENEFICIARY)
        expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.NEW_BENEFICIARY_17)
        expect(Adjust.logEvent).not.toHaveBeenCalledWith(AdjustEvents.NEW_FREE_BENEFICIARY)
        expect(Adjust.logEvent).not.toHaveBeenCalledWith(AdjustEvents.NEW_BENEFICIARY_18)
      })

      it('should only log NEW_BENEFICIARY and NEW_BENEFICIARY_18 event when user is new beneficiary with credit v3 18', async () => {
        await storage.saveObject('adjust_events', {
          alreadySeenAsNotBeneficiary: true,
        })

        logAdjustBeneficiaryEvent({
          ...beneficiaryUserV2,
          creditType: UserCreditType.CREDIT_V3_18,
        })

        await callbackPromise

        expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.NEW_BENEFICIARY)
        expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.NEW_BENEFICIARY_18)
        expect(Adjust.logEvent).not.toHaveBeenCalledWith(AdjustEvents.NEW_FREE_BENEFICIARY)
        expect(Adjust.logEvent).not.toHaveBeenCalledWith(AdjustEvents.NEW_BENEFICIARY_17)
      })

      it('should only log NEW_BENEFICIARY and NEW_BENEFICIARY_18 event when user is new beneficiary with credit v2 18', async () => {
        await storage.saveObject('adjust_events', {
          alreadySeenAsNotBeneficiary: true,
        })

        logAdjustBeneficiaryEvent({
          ...beneficiaryUserV2,
          creditType: UserCreditType.CREDIT_V2_18,
        })

        await callbackPromise

        expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.NEW_BENEFICIARY)
        expect(Adjust.logEvent).toHaveBeenCalledWith(AdjustEvents.NEW_BENEFICIARY_18)
        expect(Adjust.logEvent).not.toHaveBeenCalledWith(AdjustEvents.NEW_FREE_BENEFICIARY)
        expect(Adjust.logEvent).not.toHaveBeenCalledWith(AdjustEvents.NEW_BENEFICIARY_17)
      })
    })
  })
})
