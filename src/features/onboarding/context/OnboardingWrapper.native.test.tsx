import {
  OnboardingWrapper,
  useOnboardingContext,
} from 'features/onboarding/context/OnboardingWrapper'
import { NonEligible } from 'features/onboarding/types'
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
    (modalType) => {
      const { result } = renderOnboardingHook()

      act(() => {
        result.current.showNonEligibleModal(modalType)
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
