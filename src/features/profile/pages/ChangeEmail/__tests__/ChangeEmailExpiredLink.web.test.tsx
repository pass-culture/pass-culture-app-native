import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigateToHome } from 'features/navigation/helpers'
import { ChangeEmailExpiredLink } from 'features/profile/pages/ChangeEmail/ChangeEmailExpiredLink'
import { fireEvent, render } from 'tests/utils/web'

jest.mock('features/navigation/helpers')

describe('<ChangeEmailExpiredLink />', () => {
  it('should render correctly', () => {
    const renderAPI = renderChangeEmailExpiredLink()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to home page when go back to home button is clicked', async () => {
    const { getByText } = await renderChangeEmailExpiredLink()

    fireEvent.click(getByText(`Retourner à l'accueil`))

    await waitForExpect(() => {
      expect(navigateToHome).toBeCalledTimes(1)
    })
  })
})

function renderChangeEmailExpiredLink() {
  return render(<ChangeEmailExpiredLink />)
}
