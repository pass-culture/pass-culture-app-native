import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { render, screen, fireEvent, waitFor } from 'tests/utils'

import { SuspensionConfirmation } from './SuspensionConfirmation'

jest.mock('react-query')

const mockSignOut = jest.fn()
jest.mock('features/auth/helpers/useLogoutRoutine', () => ({
  useLogoutRoutine: jest.fn(() => mockSignOut.mockResolvedValueOnce(jest.fn())),
}))

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('<SuspensionConfirmation/>', () => {
  it('should match snapshot', () => {
    render(<SuspensionConfirmation />)

    expect(screen).toMatchSnapshot()
  })

  it('should open mail app when clicking on "Contacter le support" button', () => {
    render(<SuspensionConfirmation />)

    const contactSupportButton = screen.getByText('Contacter le support')
    fireEvent.press(contactSupportButton)

    expect(openUrl).toBeCalledWith(
      contactSupport.forGenericQuestion.url,
      contactSupport.forGenericQuestion.params,
      true
    )
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
