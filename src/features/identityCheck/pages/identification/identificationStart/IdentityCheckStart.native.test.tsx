import React from 'react'

import { initialSubscriptionState as mockState } from 'features/identityCheck/context/reducer'
import { IdentityCheckStart } from 'features/identityCheck/pages/identification/identificationStart/IdentityCheckStart'
import { fireEvent, render } from 'tests/utils'

jest.mock('react-query')
jest.mock('features/identityCheck/context/SubscriptionContextProvider', () => ({
  useSubscriptionContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))

describe('<IdentityCheckStart/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<IdentityCheckStart />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to Ubble webview when user choose "Commencer la vérification"', () => {
    const { getByTestId, getByText } = render(<IdentityCheckStart />)
    fireEvent.press(getByTestId('Commencer la vérification'))
    expect(getByText('Quelques conseils')).toBeTruthy()
  })

  it('should navigate to DMS modal when user choose "Transmettre un document"', () => {
    const { getByTestId, getByText } = render(<IdentityCheckStart />)
    fireEvent.press(getByTestId('Transmettre un document'))
    expect(getByText('Je suis de nationalité française')).toBeTruthy()
  })
})
