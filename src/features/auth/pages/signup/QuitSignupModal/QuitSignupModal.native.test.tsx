import React from 'react'

import { SignupStep } from 'features/auth/enums'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

import { QuitSignupModal } from './QuitSignupModal'

jest.mock('features/navigation/helpers')

const resumeMock = jest.fn()

describe('QuitSignupModal', () => {
  beforeEach(() => {
    // @ts-expect-error: logCancelSignup is the mock function but is seen as the real function
    analytics.logCancelSignup.mockClear()
  })

  it('should render correctly', () => {
    const renderAPI = renderQuitSignupModal(true)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should not display the modal when visible is false', () => {
    const { queryByText } = renderQuitSignupModal(false)

    const title = queryByText('Veux-tu abandonner l’inscription ?')
    expect(title).not.toBeOnTheScreen()
  })

  it('should display the modal when visible is true', () => {
    const { queryByText } = renderQuitSignupModal(true)

    const button = queryByText('Veux-tu abandonner l’inscription ?')
    expect(button).toBeOnTheScreen()
  })

  it('should call resume function when clicking on "Continuer l’inscription"', () => {
    const { getByText } = renderQuitSignupModal(true)

    const resumeButton = getByText('Continuer l’inscription')
    fireEvent.press(resumeButton)

    expect(resumeMock).toHaveBeenCalledTimes(1)
  })

  it('should go back to homepage when clicking on "Abandonner l’inscription"', () => {
    const { getByText } = renderQuitSignupModal(true)

    const abandonButton = getByText('Abandonner l’inscription')
    fireEvent.press(abandonButton)

    expect(navigateToHome).toHaveBeenCalledTimes(1)
  })

  describe('QuitSignupModal - Analytics', () => {
    it('should log CancelSignup when clicking on "Continuer l’inscription"', () => {
      const { getByText } = renderQuitSignupModal(true)

      const resumeButton = getByText('Continuer l’inscription')
      fireEvent.press(resumeButton)

      expect(analytics.logContinueSignup).toHaveBeenCalledTimes(1)
    })

    it('should log CancelSignup when clicking on "Abandonner l’inscription"', () => {
      const { getByText } = renderQuitSignupModal(true)

      const abandonButton = getByText('Abandonner l’inscription')
      fireEvent.press(abandonButton)

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
