import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import * as useCheckHasCurrentEmailChange from 'features/profile/helpers/useCheckHasCurrentEmailChange'
import { ConfirmChangeEmail } from 'features/profile/pages/ConfirmChangeEmail/ConfirmChangeEmail'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/navigation/navigationRef')

const useCheckHasCurrentEmailChangeSpy = jest
  .spyOn(useCheckHasCurrentEmailChange, 'useCheckHasCurrentEmailChange')
  .mockReturnValue({
    hasCurrentEmailChange: true,
  })

describe('<ConfirmChangeEmail />', () => {
  it('should navigate to home if no current email change', () => {
    useCheckHasCurrentEmailChangeSpy.mockReturnValueOnce({
      hasCurrentEmailChange: false,
    })
    render(<ConfirmChangeEmail />)
    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })

  it('should display confirmation message and buttons', () => {
    render(<ConfirmChangeEmail />)
    expect(screen.getByText('Confirmes-tu la demande de changement d’e-mail ?')).toBeTruthy()
    expect(screen.getByText('Confirmer la demande')).toBeTruthy()
    expect(screen.getByText('Fermer')).toBeTruthy()
  })

  it('should navigate to home when confirming email', () => {
    render(<ConfirmChangeEmail />)
    fireEvent.press(screen.getByText('Confirmer la demande'))
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('TrackEmailChange')
  })

  it('should navigate to home when closing', () => {
    render(<ConfirmChangeEmail />)
    fireEvent.press(screen.getByText('Fermer'))
    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })
})
