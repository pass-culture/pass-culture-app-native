import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { EmailHistoryEventTypeEnum } from 'api/gen'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { ValidationChangeEmail } from 'features/profile/pages/ValidationChangeEmail/ValidationChangeEmail'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/navigation/navigationRef')

const useEmailUpdateStatusSpy = jest
  .spyOn(useEmailUpdateStatus, 'useEmailUpdateStatus')
  .mockReturnValue({
    data: {
      expired: false,
      newEmail: 'test123@mail.fr',
      status: EmailHistoryEventTypeEnum.VALIDATION,
    },
    isLoading: false,
  })

describe('<ConfirmChangeEmail />', () => {
  it('should navigate to home if no current email change', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
    })
    render(<ValidationChangeEmail />)
    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })

  it('should display validation messages and buttons', () => {
    render(<ValidationChangeEmail />)

    expect(screen.getByText('Valides-tu la nouvelle adresse e-mail ?')).toBeTruthy()
    expect(screen.getByText('test123@mail.fr')).toBeTruthy()
    expect(screen.getByText('Valider l’adresse e-mail')).toBeTruthy()
    expect(screen.getByText('Fermer')).toBeTruthy()
  })

  it('should navigate to TrackEmailChange when validate email', () => {
    render(<ValidationChangeEmail />)
    fireEvent.press(screen.getByText('Valider l’adresse e-mail'))
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(navigate).toHaveBeenCalledWith('TrackEmailChange')
  })

  it('should navigate to home when closing', () => {
    render(<ValidationChangeEmail />)
    fireEvent.press(screen.getByText('Fermer'))
    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })
})
