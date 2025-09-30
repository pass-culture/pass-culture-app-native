import React from 'react'

import { api } from 'api/api'
import { EmailValidationRemainingResendsResponse } from 'api/gen'
import { analytics } from 'libs/analytics/provider'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { eventMonitoring } from 'libs/monitoring/services'
import { MODAL_TO_SHOW_TIME } from 'tests/constants'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderAsync, screen, userEvent, waitFor } from 'tests/utils'

import { EmailResendModal } from './EmailResendModal'

jest.mock('libs/monitoring/services')

const resendEmailValidationSpy = jest.spyOn(api, 'postNativeV1ResendEmailValidation')

const useRemoteConfigSpy = jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<EmailResendModal />', () => {
  it('should render correctly', async () => {
    await renderEmailResendModal({})
    jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

    expect(screen).toMatchSnapshot()
  })

  it('should dismiss modal when close icon is pressed', async () => {
    await renderEmailResendModal({})

    await user.press(screen.getByLabelText('Fermer la modale'))

    expect(onDismissMock).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when resend email button is clicked', async () => {
    await renderEmailResendModal({})

    await user.press(screen.getByLabelText('Demander un nouveau lien'))

    expect(analytics.logResendEmailValidation).toHaveBeenCalledTimes(1)
  })

  it('should resend email when resend email button is clicked', async () => {
    await renderEmailResendModal({})

    await user.press(screen.getByText('Demander un nouveau lien'))

    expect(resendEmailValidationSpy).toHaveBeenCalledTimes(1)
  })

  it('should display timer when resend email button is clicked', async () => {
    await renderEmailResendModal({})

    await user.press(screen.getByText('Demander un nouveau lien'))

    expect(
      await screen.findByText(
        'Nous t’avons envoyé un nouveau lien. Une autre demande sera possible dans 60s.'
      )
    ).toBeOnTheScreen()
  })

  it('should display error message when email resend fails', async () => {
    await renderEmailResendModal({ emailResendErrorCode: 500 })

    expect(screen.getByText('Demander un nouveau lien')).toBeEnabled()

    const button = screen.getByText('Demander un nouveau lien')
    await user.press(button)

    const text = await screen.findByText(
      'Une erreur s’est produite lors de l’envoi du nouveau lien. Réessaie plus tard.'
    )

    expect(text).toBeOnTheScreen()
  })

  it('should display error message when maximum number of resends is reached', async () => {
    await renderEmailResendModal({ emailResendErrorCode: 429 })

    await user.press(screen.getByText('Demander un nouveau lien'))

    expect(
      await screen.findByText('Tu as dépassé le nombre de renvois autorisés.')
    ).toBeOnTheScreen()
  })

  it('should reset error message when another resend attempt is made', async () => {
    mockServer.postApi('/v1/resend_email_validation', {
      responseOptions: { statusCode: 500, data: 'error' },
    })
    await renderEmailResendModal({})

    await user.press(screen.getByText('Demander un nouveau lien'))

    expect(
      screen.queryByText(
        "Une erreur s'est produite lors de l'envoi du nouveau lien. Réessaie plus tard."
      )
    ).not.toBeOnTheScreen()
  })

  it('should display alert banner when there is no attempt left', async () => {
    mockServer.postApi('/v1/email_validation_remaining_resends/john.doe%40example.com', {
      remainingResends: 0,
      counterResetDatetime: '2023-09-30T12:58:04.065652Z',
    })

    await renderEmailResendModal({})

    await screen.findAllByLabelText('Recevoir un nouveau lien')

    expect(
      screen.queryByText(
        'Tu as dépassé le nombre de 3 demandes de lien autorisées. Tu pourras réessayer le 30/09/2023 à 12h58.'
      )
    ).not.toBeOnTheScreen()
  })

  describe('When shouldLogInfo remote config is false', () => {
    beforeAll(() => {
      useRemoteConfigSpy.mockReturnValue({
        ...remoteConfigResponseFixture,
        data: {
          ...DEFAULT_REMOTE_CONFIG,
          shouldLogInfo: false,
        },
      })
    })

    it('should not log to Sentry on error', async () => {
      await renderEmailResendModal({ emailResendErrorCode: 500 })

      await user.press(screen.getByText('Demander un nouveau lien'))

      expect(eventMonitoring.captureException).toHaveBeenCalledTimes(0)
    })
  })

  describe('When shouldLogInfo remote config is true', () => {
    beforeAll(() => {
      useRemoteConfigSpy.mockReturnValue({
        ...remoteConfigResponseFixture,
        data: {
          ...DEFAULT_REMOTE_CONFIG,
          shouldLogInfo: true,
        },
      })
    })

    afterAll(() => {
      useRemoteConfigSpy.mockReturnValue(remoteConfigResponseFixture)
    })

    it('should log to Sentry on error', async () => {
      await renderEmailResendModal({ emailResendErrorCode: 500 })

      await user.press(screen.getByText('Demander un nouveau lien'))

      await waitFor(() => {
        expect(eventMonitoring.captureException).toHaveBeenCalledWith(
          'Could not resend validation email: error',
          { level: 'info' }
        )
      })
    })
  })
})

const onDismissMock = jest.fn()
const renderEmailResendModal = async ({
  emailResendErrorCode,
}: {
  emailResendErrorCode?: number
}) => {
  if (emailResendErrorCode) {
    mockServer.postApi('/v1/resend_email_validation', {
      responseOptions: { statusCode: emailResendErrorCode, data: 'error' },
      requestOptions: { persist: true },
    })
  } else {
    mockServer.postApi('/v1/resend_email_validation', {
      responseOptions: { statusCode: 200, data: '' },
      requestOptions: { persist: true },
    })
  }
  mockServer.getApi<EmailValidationRemainingResendsResponse>(
    '/v1/email_validation_remaining_resends/john.doe%40example.com',
    {
      requestOptions: { persist: true },
      responseOptions: {
        data: {
          remainingResends: 3,
        },
      },
    }
  )
  const render = await renderAsync(
    reactQueryProviderHOC(
      <EmailResendModal email="john.doe@example.com" visible onDismiss={onDismissMock} />
    )
  )
  await screen.findByText(/Attention, il te reste :/i)
  return render
}
