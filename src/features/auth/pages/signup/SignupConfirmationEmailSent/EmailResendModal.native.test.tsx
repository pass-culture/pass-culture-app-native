import React from 'react'

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
})
