import {
  OnboardingWrapper,
  useOnboardingContext,
} from 'features/tutorial/context/OnboardingWrapper'
import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { mockSettings } from 'tests/mockSettings'
import { renderHook, act } from 'tests/utils'

const mockShowModal = jest.fn()

mockSettings()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    hideModal: jest.fn(),
    showModal: mockShowModal,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('useOnboardingContext()', () => {
  beforeEach(() => setFeatureFlags())

  it('should show modal when showNonEligibleModal is called', () => {
    const { result } = renderOnboardingHook()

    act(() => {
      result.current.showNonEligibleModal(NonEligible.UNDER_15, TutorialTypes.PROFILE_TUTORIAL)
    })

    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })
})

function renderOnboardingHook() {
  return renderHook(useOnboardingContext, {
    wrapper: OnboardingWrapper,
  })
}
