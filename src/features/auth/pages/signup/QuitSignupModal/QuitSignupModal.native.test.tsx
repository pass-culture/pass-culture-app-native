import React from 'react'

import { SignupStep } from 'features/auth/enums'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

import { QuitSignupModal } from './QuitSignupModal'

jest.mock('features/navigation/helpers/navigateToHome')

const resumeMock = jest.fn()

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('QuitSignupModal', () => {
  beforeEach(() => {
    // @ts-expect-error: logCancelSignup is the mock function but is seen as the real function
    analytics.logCancelSignup.mockClear()
  })

  it('should render correctly', () => {
    renderQuitSignupModal(true)

    expect(screen).toMatchSnapshot()
  })

  it('should not display the modal when visible is false', () => {
    renderQuitSignupModal(false)

    const title = screen.queryByText('Veux-tu abandonner l’inscription ?')

    expect(title).not.toBeOnTheScreen()
  })

  it('should display the modal when visible is true', () => {
    renderQuitSignupModal(true)

    const button = screen.queryByText('Veux-tu abandonner l’inscription ?')

    expect(button).toBeOnTheScreen()
  })

  it('should call resume function when clicking on "Continuer l’inscription"', async () => {
    renderQuitSignupModal(true)

    const resumeButton = screen.getByText('Continuer l’inscription')
    await user.press(resumeButton)

    expect(resumeMock).toHaveBeenCalledTimes(1)
  })

  it('should go back to homepage when clicking on "Abandonner l’inscription"', async () => {
    renderQuitSignupModal(true)

    const abandonButton = screen.getByText('Abandonner l’inscription')
    await user.press(abandonButton)

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  describe('QuitSignupModal - Analytics', () => {
    it('should log CancelSignup when clicking on "Continuer l’inscription"', async () => {
      renderQuitSignupModal(true)

      const resumeButton = screen.getByText('Continuer l’inscription')
      await user.press(resumeButton)

      expect(analytics.logContinueSignup).toHaveBeenCalledTimes(1)
    })

    it('should log CancelSignup when clicking on "Abandonner l’inscription"', async () => {
      renderQuitSignupModal(true)

      const abandonButton = screen.getByText('Abandonner l’inscription')
      await user.press(abandonButton)

      expect(analytics.logCancelSignup).toHaveBeenCalledTimes(1)
      expect(analytics.logCancelSignup).toHaveBeenCalledWith('Birthday')
    })
  })
})

function renderQuitSignupModal(visible: boolean) {
  const props = {
    visible: visible,
    resume: resumeMock,
    signupStep: SignupStep.Birthday,
  }
  return render(<QuitSignupModal {...props} />)
}
