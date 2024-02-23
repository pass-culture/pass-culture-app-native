import React from 'react'

import { render, screen } from 'tests/utils'

import { ChangeEmailDisclaimer } from './ChangeEmailDisclaimer'

describe('<ChangeEmailDisclaimer />', () => {
  it('should display the disclaimer', () => {
    render(<ChangeEmailDisclaimer />)

    expect(
      screen.getByText(
        'Pour modifier ton adress e-mail, tu dois d’abord faire une demande de modification.'
      )
    ).toBeOnTheScreen()
  })
})
