import React from 'react'

import { IdentityCheckPendingBadge } from 'features/profile/components/Badges/IdentityCheckPendingBadge'
import { render } from 'tests/utils'

describe('IdentityCheckPendingBadge', () => {
  it('should display correct message', () => {
    const { queryByText } = render(<IdentityCheckPendingBadge />)
    expect(queryByText('Ton inscription est en cours de traitement.')).toBeTruthy()
  })
})
