import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { render, screen, fireEvent, waitFor } from 'tests/utils'

import { SuspensionConfirmation } from './SuspensionConfirmation'

jest.mock('react-query')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

describe('<SuspensionConfirmation/>', () => {
  it('should match snapshot', () => {
    render(<SuspensionConfirmation />)

    expect(screen).toMatchSnapshot()
  })

  it('should go to home page when clicking on go to home button', async () => {
    render(<SuspensionConfirmation />)

    const homeButton = screen.getByText('Retourner à l’accueil')
    fireEvent.press(homeButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(
        1,
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
      expect(mockSignOut).toBeCalledTimes(1)
    })
  })
})
