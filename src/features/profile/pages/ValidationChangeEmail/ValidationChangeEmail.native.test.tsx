import React from 'react'
import { useMutation } from 'react-query'

import { navigate } from '__mocks__/@react-navigation/native'
import { EmailHistoryEventTypeEnum } from 'api/gen'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { ValidationChangeEmail } from 'features/profile/pages/ValidationChangeEmail/ValidationChangeEmail'
import { fireEvent, render, screen } from 'tests/utils'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

jest.mock('features/navigation/navigationRef')
jest.mock('react-query')

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

const mockedUseMutation = jest.mocked(useMutation)
const mockUseMutationSuccess = () => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  mockedUseMutation.mockImplementation((mutationFunction, { onSuccess }) => ({
    mutationFunction,
    mutationOptions: { onSuccess },
    mutate: () => onSuccess(),
  }))
}
mockUseMutationSuccess()

const mockUseMutationError = () => {
  // @ts-ignore we don't use the other properties of UseMutationResult (such as failureCount)
  mockedUseMutation.mockImplementation((mutationFunction, { onError }) => ({
    mutationFunction,
    mutationOptions: { onError },
    mutate: () => {
      onError()
    },
  }))
}

const mockShowSuccessSnackBar = jest.fn()
const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showSuccessSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowSuccessSnackBar(props)),
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
  SNACK_BAR_TIME_OUT: 5000,
}))

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
    mockUseMutationSuccess()
    render(<ValidationChangeEmail />)
    fireEvent.press(screen.getByText('Valider l’adresse e-mail'))
    expect(navigate).toHaveBeenCalledTimes(1)
    expect(mockShowSuccessSnackBar).toBeCalledWith({
      message:
        'Ton adresse e-mail est modifiée. Tu peux te reconnecter avec ta nouvelle adresse e-mail.',
      timeout: 5000,
    })
    expect(navigate).toHaveBeenCalledWith('TrackEmailChange')
  })

  it('should navigate to home if token validation fails', () => {
    mockUseMutationError()
    render(<ValidationChangeEmail />)
    fireEvent.press(screen.getByText('Valider l’adresse e-mail'))
    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
    expect(mockShowErrorSnackBar).toBeCalledWith({
      message:
        'Une erreur s’est produite pendant la modification de ton e-mail. Réessaie plus tard.',
      timeout: 5000,
    })
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
