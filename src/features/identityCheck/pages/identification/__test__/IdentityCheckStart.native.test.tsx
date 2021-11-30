import React from 'react'

import { IdentityCheckStart } from 'features/identityCheck/pages/identification/IdentityCheckStart'
import { fireEvent, render } from 'tests/utils'

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useIdentityCheckNavigation', () => ({
  useIdentityCheckNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))

describe('<IdentityCheckStart/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckStart />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to next screen on press modal continue', () => {
    const { getByText } = render(<IdentityCheckStart />)
    expect(mockNavigateToNextScreen).not.toHaveBeenCalled()

    fireEvent.press(getByText('Commencer la vérification'))
    fireEvent.press(getByText("J'ai compris"))
    expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
  })
})
