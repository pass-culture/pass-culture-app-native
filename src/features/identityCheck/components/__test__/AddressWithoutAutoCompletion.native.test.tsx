import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { AddressWithoutAutoCompletion } from 'features/identityCheck/components/AddressWithoutAutoCompletion'
import { fireEvent, render, waitFor } from 'tests/utils'

const mockDispatch = jest.fn()
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: () => ({ dispatch: mockDispatch }),
}))

const QUERY_ADDRESS = '1 rue Poissonnière'

describe('<AddressWithoutAutoCompletion/>', () => {
  it('should render correctly', () => {
    const renderAPI = render(<AddressWithoutAutoCompletion />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should save address when clicking on "Continuer"', async () => {
    const { getByText, getByPlaceholderText } = render(<AddressWithoutAutoCompletion />)

    const input = getByPlaceholderText("Ex : 34 avenue de l'Opéra")
    fireEvent.changeText(input, QUERY_ADDRESS)
    fireEvent.press(getByText('Continuer'))

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenNthCalledWith(1, {
        type: 'SET_ADDRESS',
        payload: QUERY_ADDRESS,
      })
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toBeCalledWith('IdentityCheckStatus')
    })
  })
})