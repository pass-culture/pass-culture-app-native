import React from 'react'

import { api } from 'api/api'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen } from 'tests/utils'

import { EmailResendModal } from './EmailResendModal'

const resendEmailValidationSpy = jest.spyOn(api, 'postNativeV1ResendEmailValidation')

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
})

const onDismissMock = jest.fn()
const renderEmailResendModal = () =>
  render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <EmailResendModal email="john.doe@example.com" visible onDismiss={onDismissMock} />
    )
  )
