import React from 'react'

import { YoungerBadge } from 'features/profile/components/YoungerBadge'
import { render } from 'tests/utils'

let mockDepositAmount = '300 €'
jest.mock('features/auth/api', () => ({ useDepositAmount: () => mockDepositAmount }))

describe('YoungerBadge', () => {
  it('should display correct depositAmount', () => {
    mockDepositAmount = '300 €'
    let { queryByText } = render(<YoungerBadge />)
    expect(queryByText(/tu bénéficieras de 300€ offerts/)).toBeTruthy()

    mockDepositAmount = '500 €'
    queryByText = render(<YoungerBadge />).queryByText
    expect(queryByText(/tu bénéficieras de 500€ offerts/)).toBeTruthy()
  })
})
