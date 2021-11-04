import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import waitForExpect from 'wait-for-expect'

import { contactSupport } from 'features/auth/support.services'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { ChangeEmailExpiredLink } from 'features/profile/pages/ChangeEmail/ChangeEmailExpiredLink'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/navigation/helpers')

const userEmail = 'john@wick.com'

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

  it('should open mail app when clicking on contact support button', async () => {
    const { getByText } = renderChangeEmailExpiredLink()

    const contactSupportButton = getByText('Contacter le support')
    fireEvent.press(contactSupportButton)

    await waitForExpect(() => {
      expect(contactSupport.forChangeEmailExpiredLink).toHaveBeenCalledWith(userEmail)
    })
  })
})

function renderChangeEmailExpiredLink() {
  const navigationProps = {
    route: { params: { email: userEmail } },
  } as StackScreenProps<RootStackParamList, 'ChangeEmailExpiredLink'>
  return render(<ChangeEmailExpiredLink {...navigationProps} />)
}
