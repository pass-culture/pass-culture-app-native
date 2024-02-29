import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { EmailHistoryEventTypeEnum } from 'api/gen'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import * as useEmailUpdateStatus from 'features/profile/helpers/useEmailUpdateStatus'
import { TrackEmailChangeContentDeprecated } from 'features/profile/pages/TrackEmailChange/TrackEmailChangeContentDeprecated'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { act, render, screen } from 'tests/utils'

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

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.useFakeTimers({ legacyFakeTimers: true })

describe('TrackEmailChangeContentDeprecated', () => {
  it('should display "Envoi de ta demande"', () => {
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.getByText('Envoi de ta demande')).toBeOnTheScreen()
  })

  it('should not display the update app banner when FF is disabled', async () => {
    render(<TrackEmailChangeContentDeprecated />)

    await act(() => {})

    const updateAppBanner = screen.queryByText(
      'Tu dois mettre à jour ton application pour pouvoir modifier ton adresse e-mail'
    )

    expect(updateAppBanner).not.toBeOnTheScreen()
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
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.getByText('Confirme ta demande')).toBeOnTheScreen()
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
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.queryByText('Confirme ta demande')).not.toBeOnTheScreen()
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
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.getByText('Confirmation de ta demande')).toBeOnTheScreen()
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
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.queryByText('Confirmation de ta demande')).not.toBeOnTheScreen()
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
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.getByText('Valide ta nouvelle adresse')).toBeOnTheScreen()
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
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.queryByText('Valide ta nouvelle adresse')).not.toBeOnTheScreen()
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
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.getByText('Validation de ta nouvelle adresse')).toBeOnTheScreen()
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
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.queryByText('Validation de ta nouvelle adresse')).not.toBeOnTheScreen()
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
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.getByText('Connecte-toi sur ta nouvelle adresse')).toBeOnTheScreen()
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
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.queryByText('Connecte-toi sur ta nouvelle adresse')).not.toBeOnTheScreen()
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
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.getByText('Connexion sur ta nouvelle adresse')).toBeOnTheScreen()
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
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.queryByText('Connexion sur ta nouvelle adresse')).not.toBeOnTheScreen()
  })

  it('should set currentEmail as empty string if user email is not defined', () => {
    mockUseAuthContext.mockReturnValueOnce({ user: { email: null } })
    render(<TrackEmailChangeContentDeprecated />)

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
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.getByText('Depuis l’email envoyé à example@example.com')).toBeOnTheScreen()
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
    render(<TrackEmailChangeContentDeprecated />)

    expect(screen.getByText('Depuis l’email envoyé à new@example.com')).toBeOnTheScreen()
  })

  describe('should navigate to home', () => {
    it('When there is no email change', () => {
      useEmailUpdateStatusSpy.mockReturnValueOnce({
        data: undefined,
        isLoading: false,
      } as UseEmailUpdateStatusMock)
      render(<TrackEmailChangeContentDeprecated />)

      jest.advanceTimersByTime(500)

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
      render(<TrackEmailChangeContentDeprecated />)

      jest.advanceTimersByTime(500)

      expect(navigate).toHaveBeenNthCalledWith(1, 'ChangeEmailExpiredLink')
    })
  })

  describe('when FF disableOldChangeEmail is active', () => {
    beforeEach(() => useFeatureFlagSpy.mockReturnValueOnce(true))

    it('should display the update app banner', async () => {
      render(<TrackEmailChangeContentDeprecated />)

      const updateAppBanner = await screen.findByText(
        'Tu dois mettre à jour ton application pour pouvoir modifier ton adresse e-mail'
      )

      expect(updateAppBanner).toBeOnTheScreen()
    })

    it.each([
      undefined,
      EmailHistoryEventTypeEnum.UPDATE_REQUEST,
      EmailHistoryEventTypeEnum.CONFIRMATION,
      EmailHistoryEventTypeEnum.VALIDATION,
    ])('should disable all steps regardless of progression', (status) => {
      useEmailUpdateStatusSpy.mockReturnValueOnce({
        data: {
          expired: false,
          newEmail: 'new@mail.com',
          status,
        },
        isLoading: false,
      } as UseEmailUpdateStatusMock)
      render(<TrackEmailChangeContentDeprecated />)

      const stepCards = screen.getAllByTestId('stepcard-container')

      stepCards.forEach((stepCard) => {
        expect(stepCard.props.type).toBe('disabled')
      })
    })
  })
})
