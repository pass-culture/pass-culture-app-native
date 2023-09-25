import React from 'react'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import * as ResendEmailValidationMutationAPI from 'features/auth/api/useResendEmailValidation'
import { analytics } from 'libs/analytics'
import { eventMonitoring } from 'libs/monitoring'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

import { EmailResendModal } from './EmailResendModal'

const resendEmailValidationSpy = jest.spyOn(api, 'postNativeV1ResendEmailValidation')
const resendEmailMutationSpy = jest.spyOn(
  ResendEmailValidationMutationAPI,
  'useResendEmailValidation'
) as jest.Mock

describe('<EmailResendModal />', () => {
  it('should render correctly', () => {
    renderEmailResendModal()
    expect(screen).toMatchSnapshot()
  })

  it('should dismiss modal when close icon is pressed', () => {
    renderEmailResendModal()

    fireEvent.press(screen.getByLabelText('Fermer la modale'))

    expect(onDismissMock).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when resend email button is clicked', async () => {
    renderEmailResendModal()

    await act(async () => {
      fireEvent.press(screen.getByLabelText('Demander un nouveau lien'))
    })

    expect(analytics.logResendEmailValidation).toHaveBeenCalledTimes(1)
  })

  it('should resend email when resend email button is clicked', async () => {
    renderEmailResendModal()

    await act(async () => fireEvent.press(screen.getByText('Demander un nouveau lien')))

    expect(resendEmailValidationSpy).toHaveBeenCalledTimes(1)
  })

  it('should display error message when email resend fails', async () => {
    resendEmailValidationSpy.mockRejectedValueOnce(new ApiError(500, 'error'))
    renderEmailResendModal()

    await act(async () => fireEvent.press(screen.getByText('Demander un nouveau lien')))

    expect(
      screen.getByText(
        'Une erreur s’est produite lors de l’envoi du nouveau lien. Réessaie plus tard.'
      )
    ).toBeOnTheScreen()
  })

  it('should display error message when maximum number of resends is reached', async () => {
    resendEmailValidationSpy.mockRejectedValueOnce(new ApiError(429, 'error'))
    renderEmailResendModal()

    await act(async () => fireEvent.press(screen.getByText('Demander un nouveau lien')))

    expect(screen.getByText('Tu as dépassé le nombre de renvois autorisés.')).toBeOnTheScreen()
  })

  it('should log to Sentry on error', async () => {
    resendEmailValidationSpy.mockRejectedValueOnce(new ApiError(500, 'error'))
    renderEmailResendModal()

    await act(async () => fireEvent.press(screen.getByText('Demander un nouveau lien')))

    expect(eventMonitoring.captureMessage).toHaveBeenCalledWith(
      'Could not resend validation email: error',
      'info'
    )
  })

  it('should reset error message when another resend attempt is made', async () => {
    resendEmailValidationSpy.mockRejectedValueOnce(new ApiError(500, 'error'))
    renderEmailResendModal()

    await act(async () => fireEvent.press(screen.getByText('Demander un nouveau lien')))

    await act(async () => fireEvent.press(screen.getByText('Demander un nouveau lien')))

    expect(
      screen.queryByText(
        'Une erreur s’est produite lors de l’envoi du nouveau lien. Réessaie plus tard.'
      )
    ).not.toBeOnTheScreen()
  })

  it('should disable resend button when there is an ongoing resend request', async () => {
    resendEmailMutationSpy.mockReturnValueOnce({ isLoading: true, mutate: () => {} })
    renderEmailResendModal()

    await act(() => fireEvent.press(screen.getByText('Demander un nouveau lien')))

    expect(screen.getByText('Demander un nouveau lien')).toBeDisabled()
  })
})

const onDismissMock = jest.fn()
const renderEmailResendModal = () =>
  render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <EmailResendModal email="john.doe@example.com" visible onDismiss={onDismissMock} />
    )
  )
