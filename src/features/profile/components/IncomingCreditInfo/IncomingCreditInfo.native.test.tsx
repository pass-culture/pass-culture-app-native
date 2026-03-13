import React from 'react'

import { getAge } from 'shared/user/getAge'
import { render, screen } from 'tests/utils'

import { IncomingCreditInfo } from './IncomingCreditInfo'

jest.mock('shared/user/getAge')

const mockGetAge = getAge as jest.Mock

const props = {
  birthDate: '2008-01-01',
  seventeenYearsOldDeposit: '30 €',
  eighteenYearsOldDeposit: '300 €',
}

describe('IncomingCreditInfo', () => {
  it('should display incoming deposit for 17 years old when age is 15', () => {
    mockGetAge.mockReturnValueOnce(15)

    render(<IncomingCreditInfo {...props} />)

    expect(screen.getByText(/À venir pour tes 17 ans :/)).toBeTruthy()
    expect(screen.getByText('+ 30\u00a0€')).toBeTruthy()
  })

  it('should display incoming deposit for 17 years old when age is 16', () => {
    mockGetAge.mockReturnValueOnce(16)

    render(<IncomingCreditInfo {...props} />)

    expect(screen.getByText(/À venir pour tes 17 ans :/)).toBeTruthy()
    expect(screen.getByText('+ 30\u00a0€')).toBeTruthy()
  })

  it('should display incoming deposit for 18 years old when age is 17', () => {
    mockGetAge.mockReturnValueOnce(17)

    render(<IncomingCreditInfo {...props} />)

    expect(screen.getByText(/À venir pour tes 18 ans :/)).toBeTruthy()
    expect(screen.getByText('+ 300\u00a0€')).toBeTruthy()
  })
})
