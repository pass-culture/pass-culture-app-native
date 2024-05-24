import { YoungStatusType } from 'api/gen'
import { useOnboardingSubscriptionModal } from 'features/subscription/helpers/useOnboardingSubscriptionModal'
import { storage } from 'libs/storage'
import { renderHook, waitFor } from 'tests/utils'

describe('useOnboardingSubscriptionModal', () => {
  beforeEach(() => {
    storage.clear('logged_in_session_count')
    storage.clear('has_seen_onboarding_subscription')
  })

  it('should not display modal if user is not logged in', () => {
    const showOnboardingSubscriptionModal = jest.fn()
    renderHook(() =>
      useOnboardingSubscriptionModal({
        isLoggedIn: false,
        showOnboardingSubscriptionModal,
      })
    )

    expect(showOnboardingSubscriptionModal).not.toHaveBeenCalled()
  })

  it('should not display modal if user is not eligible', () => {
    storage.saveObject('logged_in_session_count', 3)
    const showOnboardingSubscriptionModal = jest.fn()
    renderHook(() =>
      useOnboardingSubscriptionModal({
        isLoggedIn: true,
        userStatus: YoungStatusType.non_eligible,
        showOnboardingSubscriptionModal,
      })
    )

    expect(showOnboardingSubscriptionModal).not.toHaveBeenCalled()
  })

  it('should display modal if user is eligible and in their third session', async () => {
    storage.saveObject('logged_in_session_count', 3)
    const showOnboardingSubscriptionModal = jest.fn()
    renderHook(() =>
      useOnboardingSubscriptionModal({
        isLoggedIn: true,
        userStatus: YoungStatusType.eligible,
        showOnboardingSubscriptionModal,
      })
    )

    await waitFor(() => {
      expect(showOnboardingSubscriptionModal).toHaveBeenCalledTimes(1)
    })
  })

  it('should not display modal if user is eligible and not in their third session', async () => {
    storage.saveObject('logged_in_session_count', 2)
    const showOnboardingSubscriptionModal = jest.fn()
    renderHook(() =>
      useOnboardingSubscriptionModal({
        isLoggedIn: true,
        userStatus: YoungStatusType.eligible,
        showOnboardingSubscriptionModal,
      })
    )

    expect(showOnboardingSubscriptionModal).not.toHaveBeenCalled()
  })

  it('should not display modal if user has already seen it', async () => {
    storage.saveObject('logged_in_session_count', 3)
    storage.saveObject('has_seen_onboarding_subscription', true)
    const showOnboardingSubscriptionModal = jest.fn()
    renderHook(() =>
      useOnboardingSubscriptionModal({
        isLoggedIn: true,
        userStatus: YoungStatusType.eligible,
        showOnboardingSubscriptionModal,
      })
    )

    expect(showOnboardingSubscriptionModal).not.toHaveBeenCalled()
  })
})
