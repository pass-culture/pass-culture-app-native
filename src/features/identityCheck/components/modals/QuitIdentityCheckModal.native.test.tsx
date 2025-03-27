import React from 'react'

import { QuitIdentityCheckModal } from 'features/identityCheck/components/modals/QuitIdentityCheckModal'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/navigation/helpers/navigateToHome')
const mockHideModal = jest.fn()

const mockStep = 'profile'
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: () => ({ step: mockStep }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<QuitIdentityCheckModal/>', () => {
  it('should render correctly', () => {
    renderQuitIdentityCheckModal(true)

    expect(screen).toMatchSnapshot()
  })

  it('should not display the modal when visible is false', () => {
    renderQuitIdentityCheckModal(false)

    const title = screen.queryByText('Veux-tu abandonner la vérification d’identité\u00a0?')

    expect(title).not.toBeOnTheScreen()
  })

  it('should display the modal when visible is true', () => {
    renderQuitIdentityCheckModal(true)

    const title = screen.queryByText('Veux-tu abandonner la vérification d’identité ?')

    expect(title).toBeOnTheScreen()
  })

  it('should log analytics when clicking on "Continuer la vérification"', async () => {
    renderQuitIdentityCheckModal(true)

    const resumeButton = screen.getByText('Continuer la vérification')
    await user.press(resumeButton)

    expect(analytics.logContinueIdentityCheck).toHaveBeenCalledTimes(1)
  })

  it('should call hideModal when clicking on "Continuer la vérification"', async () => {
    renderQuitIdentityCheckModal(true)

    const resumeButton = screen.getByText('Continuer la vérification')
    await user.press(resumeButton)

    expect(mockHideModal).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when clicking on "Abandonner la vérification"', async () => {
    renderQuitIdentityCheckModal(true)

    const abandonButton = screen.getByText('Abandonner la vérification')
    await user.press(abandonButton)

    expect(analytics.logQuitIdentityCheck).toHaveBeenNthCalledWith(1, mockStep)
  })

  it('should go back to homepage when clicking on "Abandonner la vérification"', async () => {
    renderQuitIdentityCheckModal(true)

    const abandonButton = screen.getByText('Abandonner la vérification')
    await user.press(abandonButton)

    expect(navigateToHome).toHaveBeenCalledTimes(1)
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
