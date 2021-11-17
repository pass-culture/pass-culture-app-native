import React from 'react'

import { QuitIdentityCheckModal } from 'features/identityCheck/pages/QuitIdentityCheckModal'
import { navigateToHome } from 'features/navigation/helpers'
import { fireEvent, render } from 'tests/utils/web'

jest.mock('features/navigation/helpers')
const resumeMock = jest.fn()

describe('<QuitIdentityCheckModal/>', () => {
  it('should not display the modal when visible is false', () => {
    const { queryByText } = renderQuitIdentityCheckModal(false)

    const title = queryByText("Veux-tu abandonner la vérification d'identité ?")
    expect(title).toBeFalsy()
  })

  it('should display the modal when visible is true', () => {
    const { queryByText } = renderQuitIdentityCheckModal(true)

    const title = queryByText("Veux-tu abandonner la vérification d'identité ?")
    expect(title).toBeTruthy()
  })

  it('should call resume function when clicking on "Continuer la vérification"', () => {
    const { getByText } = renderQuitIdentityCheckModal(true)

    const resumeButton = getByText('Continuer la vérification')
    fireEvent.click(resumeButton)

    expect(resumeMock).toHaveBeenCalled()
  })

  it('should go back to homepage when clicking on "Abandonner la vérification"', () => {
    const { getByText } = renderQuitIdentityCheckModal(true)

    const abandonButton = getByText('Abandonner la vérification')
    fireEvent.click(abandonButton)

    expect(navigateToHome).toBeCalled()
  })
})

function renderQuitIdentityCheckModal(visible: boolean) {
  const props = {
    visible: visible,
    resume: resumeMock,
    testIdSuffix: 'quit-identity-check-stepper',
  }
  return render(<QuitIdentityCheckModal {...props} />)
}
