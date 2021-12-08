import React from 'react'

import { IdentityCheckUnavailable } from 'features/identityCheck/pages/identification/IdentityCheckUnavailable'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/navigation/helpers')

jest.mock('@react-navigation/native')
describe('<IdentityCheckUnavailable />', () => {
  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckUnavailable />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to home page when go back to home button is clicked', () => {
    const { getByText } = render(<IdentityCheckUnavailable />)
    fireEvent.press(getByText("Retourner à l'accueil"))

    expect(analytics.logQuitIdentityCheckUnavailable).toHaveBeenCalledTimes(1)
    expect(navigateToHome).toBeCalledTimes(1)
  })
})
