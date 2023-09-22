import React from 'react'

import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'

import { EmailResendModal } from './EmailResendModal'

describe('<EmailResendModal />', () => {
  it('should render correctly', () => {
    render(<EmailResendModal visible onDismiss={jest.fn()} />)
    expect(screen).toMatchSnapshot()
  })

  it('should dismiss modal when close icon is pressed', () => {
    const onDismissMock = jest.fn()
    render(<EmailResendModal visible onDismiss={onDismissMock} />)

    fireEvent.press(screen.getByLabelText('Fermer la modale'))

    expect(onDismissMock).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when resend email button is clicked', () => {
    render(<EmailResendModal visible onDismiss={jest.fn()} />)

    fireEvent.press(screen.getByLabelText('Demander un nouveau lien'))

    expect(analytics.logResendEmailValidation).toHaveBeenCalledTimes(1)
  })
})
