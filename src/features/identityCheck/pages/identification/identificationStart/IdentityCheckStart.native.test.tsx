import React from 'react'

import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { IdentityCheckStart } from 'features/identityCheck/pages/identification/identificationStart/IdentityCheckStart'
import { fireEvent, render, superFlushWithAct } from 'tests/utils'

jest.mock('react-query')
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({
    dispatch: jest.fn(),
    ...mockState,
  })),
}))

describe('<IdentityCheckStart/>', () => {
  it('should render correctly', async () => {
    const renderAPI = render(<IdentityCheckStart />)
    await superFlushWithAct()
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to Ubble webview when user choose "Commencer la vérification"', async () => {
    const { getByTestId, queryByText } = render(<IdentityCheckStart />)
    await superFlushWithAct()
    fireEvent.press(getByTestId('Commencer la vérification'))
    expect(queryByText('Quelques conseils')).toBeTruthy()
  })

  it('should navigate to DMS modal when user choose "Transmettre un document"', async () => {
    const { getByTestId, queryByText } = render(<IdentityCheckStart />)
    await superFlushWithAct()
    fireEvent.press(getByTestId('Transmettre un document'))
    expect(queryByText('Je suis de nationalité française')).toBeTruthy()
    expect(queryByText('Je suis de nationalité étrangère')).toBeTruthy()
  })
})
