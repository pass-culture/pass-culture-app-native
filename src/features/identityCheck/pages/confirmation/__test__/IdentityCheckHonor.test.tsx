import React from 'react'

import { IdentityCheckHonor } from 'features/identityCheck/pages/confirmation/IdentityCheckHonor'
import { fireEvent, render } from 'tests/utils'

const mockNavigateToNextScreen = jest.fn()
jest.mock('features/identityCheck/useIdentityCheckNavigation', () => ({
  useIdentityCheckNavigation: () => ({
    navigateToNextScreen: mockNavigateToNextScreen,
  }),
}))

describe('<IdentityCheckHonor/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckHonor />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should call navigateToNextScreen on click "Valider et continuer"', () => {
    const renderAPI = render(<IdentityCheckHonor />)
    fireEvent.press(renderAPI.getByText('Valider et continuer'))
    expect(mockNavigateToNextScreen).toHaveBeenCalledTimes(1)
  })
})
