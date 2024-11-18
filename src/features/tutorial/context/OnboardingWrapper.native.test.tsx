import {
  OnboardingWrapper,
  useOnboardingContext,
} from 'features/tutorial/context/OnboardingWrapper'
import { NonEligible, TutorialTypes } from 'features/tutorial/enums'
import { renderHook, act } from 'tests/utils'

const mockShowModal = jest.fn()

jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    hideModal: jest.fn(),
    showModal: mockShowModal,
  }),
}))

describe('useOnboardingContext()', () => {
  it.each(Object.values(NonEligible))(
    'should show modal when showNonEligibleModal is called',
    (userStatus) => {
      const { result } = renderOnboardingHook()

      act(() => {
        result.current.showNonEligibleModal(userStatus, TutorialTypes.ONBOARDING)
      })

      expect(mockShowModal).toHaveBeenCalledTimes(1)
    }
  )
})

function renderOnboardingHook() {
  return renderHook(useOnboardingContext, {
    wrapper: OnboardingWrapper,
  })
}
