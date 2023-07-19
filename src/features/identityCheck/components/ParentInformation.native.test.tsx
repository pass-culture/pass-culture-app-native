import React from 'react'

import { ParentInformation } from 'features/identityCheck/components/ParentInformation'
import { analytics } from 'libs/analytics/__mocks__/provider'
import { render, screen, fireEvent } from 'tests/utils'

describe('<ParentInformation/>', () => {
  it('should open modal on click ', () => {
    render(<ParentInformation />)

    fireEvent.press(screen.getByText('En savoir plus'))

    expect(screen.findByText('Comment inscrire mon enfant\u00a0?')).toBeTruthy()
  })
})
