import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { QuitSignupModal, SignupSteps } from 'features/auth/components/QuitSignupModal'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

const resumeMock = jest.fn()

describe('QuitSignupModal', () => {
  beforeEach(() => {
    // @ts-ignore: logCancelSignup is the mock function but is seen as the real function
    analytics.logCancelSignup.mockClear()
  })

  it('should not display the modal when visible is false', () => {
    const { queryByText } = renderQuitSignupModal(false)

    const title = queryByText("Veux-tu abandonner l'inscription ?")
    expect(title).toBeFalsy()
  })

  it('should display the modal when visible is true', () => {
    const { queryByText } = renderQuitSignupModal(true)

    const button = queryByText("Veux-tu abandonner l'inscription ?")
    expect(button).toBeTruthy()
  })

  it('should call resume function when clicking on "Continuer l\'inscription"', () => {
    const { getByText } = renderQuitSignupModal(true)

    const resumeButton = getByText("Continuer l'inscription")
    fireEvent.press(resumeButton)

    expect(resumeMock).toHaveBeenCalled()
  })

  it('should go back to homepage when clicking on "Abandonner l\'inscription"', () => {
    const { getByText } = renderQuitSignupModal(true)

    const abandonButton = getByText("Abandonner l'inscription")
    fireEvent.press(abandonButton)

    expect(navigate).toHaveBeenCalledWith('Home', { shouldDisplayLoginModal: false })
  })

  describe('QuitSignupModal - Analytics', () => {
    it('should log CancelSignup when clicking on "Abandonner l\'inscription"', () => {
      const { getByText } = renderQuitSignupModal(true)

      const abandonButton = getByText("Abandonner l'inscription")
      fireEvent.press(abandonButton)

      expect(analytics.logCancelSignup).toHaveBeenCalledTimes(1)
      expect(analytics.logCancelSignup).toHaveBeenCalledWith('Birthday')
    })
  })
})

function renderQuitSignupModal(visible: boolean) {
  const props = { visible: visible, resume: resumeMock, signupStep: SignupSteps.Birthday }
  return render(<QuitSignupModal {...props} />)
}
