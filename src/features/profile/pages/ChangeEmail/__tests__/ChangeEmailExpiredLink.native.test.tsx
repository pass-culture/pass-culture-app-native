import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigateToHome } from 'features/navigation/helpers'
import { ChangeEmailExpiredLink } from 'features/profile/pages/ChangeEmail/ChangeEmailExpiredLink'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/navigation/helpers')

describe('<ChangeEmailExpiredLink />', () => {
  it('should render correctly', () => {
    const renderAPI = renderChangeEmailExpiredLink()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to home page when go back to home button is clicked', async () => {
    const { getByText } = await renderChangeEmailExpiredLink()

    fireEvent.press(getByText(`Retourner à l'accueil`))

    await waitForExpect(() => {
      expect(navigateToHome).toBeCalledTimes(1)
    })
  })

  it.skip('should log event when clicking on resend email button', async () => {
    const { getByText } = renderChangeEmailExpiredLink()

    const resendEmailButton = getByText("Renvoyer l'email")
    fireEvent.press(resendEmailButton)

    await waitForExpect(() => {
      expect(analytics.logSendActivationMailAgain).toHaveBeenCalledWith(1)
    })

    fireEvent.press(resendEmailButton)
    await waitForExpect(() => {
      expect(analytics.logSendActivationMailAgain).toHaveBeenCalledWith(2)
    })
  })
})

function renderChangeEmailExpiredLink() {
  return render(<ChangeEmailExpiredLink />)
}
