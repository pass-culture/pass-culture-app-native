import { rest } from 'msw'
import React from 'react'

import { api } from 'api/api'
import { analytics } from 'libs/analytics'
import { env } from 'libs/environment'
import { eventMonitoring } from 'libs/monitoring'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { act, fireEvent, render, screen, waitFor, waitForModalToShow } from 'tests/utils'

import { EmailResendModal } from './EmailResendModal'

const resendEmailValidationSpy = jest.spyOn(api, 'postNativeV1ResendEmailValidation')

describe('<EmailResendModal />', () => {
  it('should render correctly', async () => {
    renderEmailResendModal({})
    await waitFor(() => {
      expect(screen.getByText('Demander un nouveau lien')).toBeEnabled()
    })
    await waitForModalToShow()

    expect(screen).toMatchSnapshot()
  })

  it('should dismiss modal when close icon is pressed', async () => {
    renderEmailResendModal({})

    await act(async () => {
      fireEvent.press(screen.getByLabelText('Fermer la modale'))
    })

    expect(onDismissMock).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when resend email button is clicked', async () => {
    renderEmailResendModal({})

    await waitFor(() => {
      expect(screen.getByText('Demander un nouveau lien')).toBeEnabled()
    })

    await act(async () => {
      fireEvent.press(screen.getByLabelText('Demander un nouveau lien'))
    })

    expect(analytics.logResendEmailValidation).toHaveBeenCalledTimes(1)
  })

  it('should resend email when resend email button is clicked', async () => {
    renderEmailResendModal({})
    await waitFor(() => {
      expect(screen.getByText('Demander un nouveau lien')).toBeEnabled()
    })

    await act(async () => fireEvent.press(screen.getByText('Demander un nouveau lien')))

    expect(resendEmailValidationSpy).toHaveBeenCalledTimes(1)
  })

  it('should display timer when resend email button is clicked', async () => {
    renderEmailResendModal({})
    await waitFor(() => {
      expect(screen.getByText('Demander un nouveau lien')).toBeEnabled()
    })

    await act(async () => fireEvent.press(screen.getByText('Demander un nouveau lien')))

    expect(
      screen.getByText(
        'Nous t’avons envoyé un nouveau lien. Une autre demande sera possible dans 60s.'
      )
    ).toBeOnTheScreen()
  })

  it('should display error message when email resend fails', async () => {
    renderEmailResendModal({ emailResendErrorCode: 500 })
    await waitFor(() => {
      expect(screen.getByText('Demander un nouveau lien')).toBeEnabled()
    })

    await act(async () => fireEvent.press(screen.getByText('Demander un nouveau lien')))

    expect(
      screen.getByText(
        'Une erreur s’est produite lors de l’envoi du nouveau lien. Réessaie plus tard.'
      )
    ).toBeOnTheScreen()
  })

  it('should display error message when maximum number of resends is reached', async () => {
    renderEmailResendModal({ emailResendErrorCode: 429 })
    await waitFor(() => {
      expect(screen.getByText('Demander un nouveau lien')).toBeEnabled()
    })

    await act(async () => fireEvent.press(screen.getByText('Demander un nouveau lien')))

    expect(screen.getByText('Tu as dépassé le nombre de renvois autorisés.')).toBeOnTheScreen()
  })

  it('should log to Sentry on error', async () => {
    renderEmailResendModal({ emailResendErrorCode: 500 })
    await waitFor(() => {
      expect(screen.getByText('Demander un nouveau lien')).toBeEnabled()
    })

    await act(async () => fireEvent.press(screen.getByText('Demander un nouveau lien')))

    expect(eventMonitoring.captureMessage).toHaveBeenCalledWith(
      'Could not resend validation email: error',
      'info'
    )
  })

  it('should reset error message when another resend attempt is made', async () => {
    server.use(
      rest.post(`${env.API_BASE_URL}/native/v1/resend_email_validation`, (_req, res, ctx) =>
        res.once(ctx.status(500), ctx.text('error'))
      )
    )
    renderEmailResendModal({})
    await waitFor(() => {
      expect(screen.getByText('Demander un nouveau lien')).toBeEnabled()
    })

    await act(async () => fireEvent.press(screen.getByText('Demander un nouveau lien')))

    await act(async () => fireEvent.press(screen.getByText('Demander un nouveau lien')))

    expect(
      screen.queryByText(
        'Une erreur s’est produite lors de l’envoi du nouveau lien. Réessaie plus tard.'
      )
    ).not.toBeOnTheScreen()
  })

  it('should display alert banner when there is no attempt left', async () => {
    server.use(
      rest.get(
        `${env.API_BASE_URL}/native/v1/email_validation_remaining_resends/john.doe%40example.com`,
        (_req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({ remainingResends: 0, counterResetDatetime: '2023-09-30T12:58:04.065652Z' })
          )
      )
    )
    renderEmailResendModal({})

    await waitFor(() => {
      expect(
        screen.queryByText(
          'Tu as dépassé le nombre de 3 demandes de lien autorisées. Tu pourras réessayer le 30/09/2023 à 12h58.'
        )
      ).not.toBeOnTheScreen()
    })
  })
})

const onDismissMock = jest.fn()
const renderEmailResendModal = ({ emailResendErrorCode }: { emailResendErrorCode?: number }) => {
  server.use(
    rest.post(`${env.API_BASE_URL}/native/v1/resend_email_validation`, (_req, res, ctx) =>
      res(ctx.status(emailResendErrorCode ?? 200), ctx.text(emailResendErrorCode ? 'error' : ''))
    ),
    rest.get(
      `${env.API_BASE_URL}/native/v1/email_validation_remaining_resends/john.doe%40example.com`,
      (_req, res, ctx) => res(ctx.status(200), ctx.json({ remainingResends: 3 }))
    )
  )
  render(
    reactQueryProviderHOC(
      <EmailResendModal email="john.doe@example.com" visible onDismiss={onDismissMock} />
    )
  )
}
