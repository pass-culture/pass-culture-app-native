import React from 'react'

import { YoungerBadge } from 'features/profile/components/YoungerBadge'
import { render } from 'tests/utils'

jest.mock('features/auth/api')

describe('YoungerBadge', () => {
  it('should display correct depositAmount', () => {
    const { queryByText } = render(<YoungerBadge />)
    expect(
      queryByText(/tu bénéficieras de\u00a0300€\u00a0offerts à dépenser sur l’application./)
    ).toBeTruthy()
  })
})
