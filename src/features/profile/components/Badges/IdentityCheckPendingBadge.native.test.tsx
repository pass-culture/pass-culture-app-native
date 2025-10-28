import React from 'react'

import { IdentityCheckPendingBadge } from 'features/profile/components/Badges/IdentityCheckPendingBadge'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('IdentityCheckPendingBadge', () => {
  it('should display correct message', () => {
    render(<IdentityCheckPendingBadge />)

    expect(screen.getByText('Ton inscription est en cours de traitement.')).toBeOnTheScreen()
  })
})
