import React from 'react'

import { EmailHistoryEventTypeEnum } from 'api/gen'
import { mockGoBack } from 'features/navigation/__mocks__/useGoBack'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { TrackEmailChange } from 'features/profile/pages/TrackEmailChange/TrackEmailChange'
import { fireEvent, render, screen } from 'tests/utils'

const mockUseAuthContext = jest.fn().mockReturnValue({ user: { email: 'example@example.com' } })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

type UseEmailUpdateStatusMock = ReturnType<typeof useEmailUpdateStatus['useEmailUpdateStatus']>

const useEmailUpdateStatusSpy = jest
  .spyOn(useEmailUpdateStatus, 'useEmailUpdateStatus')
  .mockReturnValue({
    data: {
      expired: false,
      newEmail: '',
      status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
    },
    isLoading: false,
  } as UseEmailUpdateStatusMock)

jest.mock('features/navigation/navigationRef')

describe('TrackEmailChange', () => {
  it('should render the component correctly', () => {
    render(<TrackEmailChange />)
    expect(screen.getByText('Suivi de ton changement d’e-mail')).toBeTruthy()
  })

  it('should display "Envoi de ta demande"', () => {
    render(<TrackEmailChange />)
    expect(screen.getByText('Envoi de ta demande')).toBeTruthy()
  })

  it('should display "Confirme ta demande" when current step is UPDATE_REQUEST', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: 'new@mail.com',
        status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<TrackEmailChange />)
    expect(screen.getByText('Confirme ta demande')).toBeTruthy()
  })

  it('should not display "Confirme ta demande" when current step is not UPDATE_REQUEST', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: 'new@mail.com',
        status: EmailHistoryEventTypeEnum.CONFIRMATION,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<TrackEmailChange />)
    expect(screen.queryByText('Confirme ta demande')).toBeNull()
  })

  it('should display "Confirmation de ta demande" when current step is not UPDATE_REQUEST', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: 'new@mail.com',
        status: EmailHistoryEventTypeEnum.CONFIRMATION,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<TrackEmailChange />)
    expect(screen.getByText('Confirmation de ta demande')).toBeTruthy()
  })

  it('should not display "Confirmation de ta demande" when current step is UPDATE_REQUEST', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: 'new@mail.com',
        status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<TrackEmailChange />)
    expect(screen.queryByText('Confirmation de ta demande')).toBeNull()
  })

  it('should display "Valide ta nouvelle adresse" when current step is CONFIRMATION', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: 'new@mail.com',
        status: EmailHistoryEventTypeEnum.CONFIRMATION,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<TrackEmailChange />)
    expect(screen.getByText('Valide ta nouvelle adresse')).toBeTruthy()
  })

  it('should not display "Valide ta nouvelle adresse" when current step is not CONFIRMATION', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: 'new@mail.com',
        status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<TrackEmailChange />)
    expect(screen.queryByText('Valide ta nouvelle adresse')).toBeNull()
  })

  it('should display "Validation de ta nouvelle adresse" when current step is not CONFIRMATION', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: 'new@mail.com',
        status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<TrackEmailChange />)
    expect(screen.getByText('Validation de ta nouvelle adresse')).toBeTruthy()
  })

  it('should not display "Validation de ta nouvelle adresse" when current step is CONFIRMATION', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: 'new@mail.com',
        status: EmailHistoryEventTypeEnum.CONFIRMATION,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<TrackEmailChange />)
    expect(screen.queryByText('Validation de ta nouvelle adresse')).toBeNull()
  })

  it('should display "Connecte-toi sur ta nouvelle adresse" when current step is VALIDATION', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: 'new@mail.com',
        status: EmailHistoryEventTypeEnum.VALIDATION,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<TrackEmailChange />)
    expect(screen.getByText('Connecte-toi sur ta nouvelle adresse')).toBeTruthy()
  })

  it('should not display "Connecte-toi sur ta nouvelle adresse" when current step is not VALIDATION', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: 'new@mail.com',
        status: EmailHistoryEventTypeEnum.CONFIRMATION,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<TrackEmailChange />)
    expect(screen.queryByText('Connecte-toi sur ta nouvelle adresse')).toBeNull()
  })

  it('should display "Connexion sur ta nouvelle adresse" when current step is not VALIDATION', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: 'new@mail.com',
        status: EmailHistoryEventTypeEnum.CONFIRMATION,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<TrackEmailChange />)
    expect(screen.getByText('Connexion sur ta nouvelle adresse')).toBeTruthy()
  })

  it('should not display "Connexion sur ta nouvelle adresse" when current step is VALIDATION', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: 'new@mail.com',
        status: EmailHistoryEventTypeEnum.VALIDATION,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<TrackEmailChange />)
    expect(screen.queryByText('Connexion sur ta nouvelle adresse')).toBeNull()
  })

  it('should redirect to previous screen when clicking on ArrowPrevious icon', async () => {
    render(<TrackEmailChange />)

    fireEvent.press(screen.getByLabelText('Revenir en arrière'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should set currentEmail as empty string if user email is not defined', () => {
    mockUseAuthContext.mockReturnValueOnce({ user: { email: null } }), render(<TrackEmailChange />)

    expect(screen.getByText('Depuis l’email envoyé à ')).toHaveTextContent('')
  })

  it('should display the user email when is defined and the step is send request for change of e-mail', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: 'new@mail.com',
        status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<TrackEmailChange />)
    expect(screen.getByText('Depuis l’email envoyé à example@example.com')).toBeTruthy()
  })

  it('should display the new user email when the step is confirmation of your change of e-mail address on your old e-mail address', () => {
    useEmailUpdateStatusSpy.mockReturnValueOnce({
      data: {
        expired: false,
        newEmail: 'new@example.com',
        status: EmailHistoryEventTypeEnum.CONFIRMATION,
      },
      isLoading: false,
    } as UseEmailUpdateStatusMock)
    render(<TrackEmailChange />)
    expect(screen.getByText('Depuis l’email envoyé à new@example.com')).toBeTruthy()
  })

  describe('should navigate to home', () => {
    it('When there is not current email change', () => {
      useEmailUpdateStatusSpy.mockReturnValueOnce({
        data: undefined,
        isLoading: false,
      } as UseEmailUpdateStatusMock)
      render(<TrackEmailChange />)
      expect(navigateFromRef).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })

    it('When last email change expired', () => {
      useEmailUpdateStatusSpy.mockReturnValueOnce({
        data: {
          expired: true,
          newEmail: '',
          status: EmailHistoryEventTypeEnum.UPDATE_REQUEST,
        },
        isLoading: false,
      } as UseEmailUpdateStatusMock)
      render(<TrackEmailChange />)
      expect(navigateFromRef).toHaveBeenCalledWith(
        navigateToHomeConfig.screen,
        navigateToHomeConfig.params
      )
    })
  })
})
