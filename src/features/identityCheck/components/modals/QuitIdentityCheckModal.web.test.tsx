import React from 'react'

import { QuitIdentityCheckModal } from 'features/identityCheck/components/modals/QuitIdentityCheckModal'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/firebase/analytics'
import { fireEvent, render, checkAccessibilityFor, screen, waitFor } from 'tests/utils/web'

jest.mock('features/navigation/helpers')
const mockHideModal = jest.fn()

const mockStep = 'profile'
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({ step: mockStep }),
}))

describe('<QuitIdentityCheckModal/>', () => {
  it('should not display the modal when visible is false', () => {
    renderQuitIdentityCheckModal(false)

    const title = screen.queryByText('Veux-tu abandonner la vérification d’identité ?')
    expect(title).toBeFalsy()
  })

  it('should display the modal when visible is true', () => {
    renderQuitIdentityCheckModal(true)

    const title = screen.queryByText('Veux-tu abandonner la vérification d’identité ?')
    expect(title).toBeTruthy()
  })

  it('should call resume function when clicking on "Continuer la vérification"', () => {
    renderQuitIdentityCheckModal(true)

    const resumeButton = screen.getByText('Continuer la vérification')
    fireEvent.click(resumeButton)

    expect(analytics.logContinueIdentityCheck).toHaveBeenCalledTimes(1)
    expect(mockHideModal).toHaveBeenCalledTimes(1)
  })

  it('should go back to homepage when clicking on "Abandonner la vérification"', async () => {
    renderQuitIdentityCheckModal(true)

    const abandonButton = screen.getByText('Abandonner la vérification')
    fireEvent.click(abandonButton)

    await waitFor(() => {
      expect(analytics.logConfirmQuitIdentityCheck).toHaveBeenNthCalledWith(1, mockStep)
      expect(navigateToHome).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderQuitIdentityCheckModal(true)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

function renderQuitIdentityCheckModal(visible: boolean) {
  const props = {
    visible: visible,
    hideModal: mockHideModal,
    testIdSuffix: 'quit-identity-check-stepper',
  }
  return render(<QuitIdentityCheckModal {...props} />)
}
