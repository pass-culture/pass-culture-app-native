import { format } from 'date-fns'
import mockdate from 'mockdate'

import { CURRENT_DATE, SIXTEEN_AGE_DATE, EIGHTEEN_AGE_DATE } from 'features/auth/fixtures/fixtures'
import { useAdjustBeneficiaryEvent } from 'features/auth/helpers/useAdjustBeneficiaryEvent'
import { UserProfileResponseWithoutSurvey } from 'features/share/types'
import { beneficiaryUser } from 'fixtures/user'
import { Adjust } from 'libs/adjust/adjust'
import { AdjustEvents } from 'libs/adjust/adjustEvents'
import { storage } from 'libs/storage'
import { act, renderHook, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/adjust/adjust')
const AdjustMock = Adjust as jest.Mocked<typeof Adjust>

mockdate.set(CURRENT_DATE)

describe('useAdjustBeneficiaryEvent', () => {
  beforeEach(async () => {
    await storage.clear('adjust_beneficiary_event_sent')
    AdjustMock.isEnabled.mockImplementation((callback) => {
      callback(true)
    })
  })

  it('should log beneficiary event and save beneficiary event sent in storage when user is beneficiary', async () => {
    renderUseAdjustBeneficiaryEvent(beneficiaryUser)

    await waitFor(async () => {
      expect(Adjust.logEvent).toHaveBeenNthCalledWith(1, AdjustEvents.COMPLETE_BENEFICIARY)

      const adjustBeneficiaryEventSent = await storage.readObject<boolean>(
        'adjust_beneficiary_event_sent'
      )

      expect(adjustBeneficiaryEventSent).toEqual(true)
    })
  })

  it('should not log beneficiary event and not save beneficiary event sent in storage when user is not beneficiary', async () => {
    renderUseAdjustBeneficiaryEvent({
      ...beneficiaryUser,
      isBeneficiary: false,
    })

    // force to wait that all useEffect are called to check that event is not logged after
    await act(async () => {})

    expect(Adjust.logEvent).not.toHaveBeenCalled()

    const adjustBeneficiaryEventSent = await storage.readObject<boolean>(
      'adjust_beneficiary_event_sent'
    )

    expect(adjustBeneficiaryEventSent).toBeNull()
  })

  it('should log underage beneficiary event when user is beneficiary and is underage', async () => {
    renderUseAdjustBeneficiaryEvent({
      ...beneficiaryUser,
      birthDate: format(SIXTEEN_AGE_DATE, 'yyyy-MM-dd'),
    })

    await waitFor(() => {
      expect(Adjust.logEvent).toHaveBeenNthCalledWith(2, AdjustEvents.COMPLETE_BENEFICIARY_UNDERAGE)
    })
  })

  it('should not log underage beneficiary event when user is beneficiary and is not underage', async () => {
    renderUseAdjustBeneficiaryEvent({
      ...beneficiaryUser,
      birthDate: format(EIGHTEEN_AGE_DATE, 'yyyy-MM-dd'),
    })

    // force to wait that all useEffect are called to check that event is not logged after
    await act(async () => {})

    expect(Adjust.logEvent).not.toHaveBeenCalledWith(AdjustEvents.COMPLETE_BENEFICIARY_UNDERAGE)
  })

  it('should log beneficiary 18 event when user is beneficiary and is 18 or older', async () => {
    renderUseAdjustBeneficiaryEvent({
      ...beneficiaryUser,
      birthDate: format(EIGHTEEN_AGE_DATE, 'yyyy-MM-dd'),
    })

    await waitFor(() => {
      expect(Adjust.logEvent).toHaveBeenNthCalledWith(2, AdjustEvents.COMPLETE_BENEFICIARY_18)
    })
  })

  it('should not log beneficiary 18 event when user is beneficiary and is not 18 or older', async () => {
    renderUseAdjustBeneficiaryEvent({
      ...beneficiaryUser,
      birthDate: format(SIXTEEN_AGE_DATE, 'yyyy-MM-dd'),
    })

    // force to wait that all useEffect are called to check that event is not logged after
    await act(async () => {})

    expect(Adjust.logEvent).not.toHaveBeenCalledWith(AdjustEvents.COMPLETE_BENEFICIARY_18)
  })

  it('should log beneficiary event when user becomes beneficiary', async () => {
    const { rerender } = renderUseAdjustBeneficiaryEvent({
      ...beneficiaryUser,
      isBeneficiary: false,
    })

    // force to wait that all useEffect are called to check that event is not logged after
    await act(async () => {})

    expect(Adjust.logEvent).not.toHaveBeenCalled()

    rerender({
      user: {
        ...beneficiaryUser,
        isBeneficiary: true,
      },
    })

    await waitFor(() => {
      expect(Adjust.logEvent).toHaveBeenNthCalledWith(1, AdjustEvents.COMPLETE_BENEFICIARY)
    })
  })

  it('should not log beneficiary event twice', async () => {
    const { rerender } = renderUseAdjustBeneficiaryEvent({
      ...beneficiaryUser,
      birthDate: format(EIGHTEEN_AGE_DATE, 'yyyy-MM-dd'),
    })

    await waitFor(() => {
      expect(Adjust.logEvent).toHaveBeenNthCalledWith(1, AdjustEvents.COMPLETE_BENEFICIARY)
    })

    jest.clearAllMocks()

    // With new user birthdate to force useEffect to rerun
    rerender({
      user: {
        ...beneficiaryUser,
        birthDate: format(SIXTEEN_AGE_DATE, 'yyyy-MM-dd'),
      },
    })

    // force to wait that all useEffect are called to check that event is not logged after
    await act(async () => {})

    expect(Adjust.logEvent).not.toHaveBeenCalled()
  })

  it('should log beneficiary event if Adjust is initialized', async () => {
    renderUseAdjustBeneficiaryEvent(beneficiaryUser)

    await waitFor(() => {
      expect(Adjust.logEvent).toHaveBeenCalledTimes(2)
    })
  })

  it('should not log beneficiary event if Adjust is not initialized', async () => {
    AdjustMock.isEnabled.mockImplementationOnce((callback) => {
      callback(false)
    })

    renderUseAdjustBeneficiaryEvent(beneficiaryUser)

    // force to wait that all useEffect are called to check that event is not logged after
    await act(async () => {})

    expect(Adjust.logEvent).not.toHaveBeenCalled()
  })

  it('should log beneficiary event when Adjust becomes initialized', async () => {
    AdjustMock.isEnabled.mockImplementationOnce((callback) => {
      callback(false)
    })

    const { rerender } = renderUseAdjustBeneficiaryEvent(beneficiaryUser)

    // force to wait that all useEffect are called to check that event is not logged after
    await act(async () => {})

    expect(Adjust.logEvent).not.toHaveBeenCalled()

    AdjustMock.isEnabled.mockImplementationOnce((callback) => {
      callback(true)
    })

    // With new user birthdate to force useEffect to rerun
    rerender({
      user: {
        ...beneficiaryUser,
        birthDate: format(SIXTEEN_AGE_DATE, 'yyyy-MM-dd'),
      },
    })

    await waitFor(() => {
      expect(Adjust.logEvent).toHaveBeenCalledTimes(2)
    })
  })
})

const renderUseAdjustBeneficiaryEvent = (initialUser: UserProfileResponseWithoutSurvey) => {
  return renderHook(
    ({ user }: { user: UserProfileResponseWithoutSurvey }) => useAdjustBeneficiaryEvent(user),
    {
      initialProps: { user: initialUser },
    }
  )
}
