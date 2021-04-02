import { render } from '@testing-library/react-native'
import React from 'react'

import { YoungerBadge } from 'features/profile/components/YoungerBadge'

let mockDepositAmount = 30000
jest.mock('features/auth/api', () => ({ useDepositAmount: () => mockDepositAmount }))

describe('YoungerBadge', () => {
  it('should display correct depositAmount', () => {
    mockDepositAmount = 30000
    let { queryByText } = render(<YoungerBadge />)
    expect(queryByText(/tu bénéficieras de 300€ offerts/)).toBeTruthy()

    mockDepositAmount = 50000
    queryByText = render(<YoungerBadge />).queryByText
    expect(queryByText(/tu bénéficieras de 500€ offerts/)).toBeTruthy()
  })
})
