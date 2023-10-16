import React from 'react'

import { UnderageBlockDescription } from 'features/tutorial/components/profileTutorial/UnderageBlockDescription'
import { nonBeneficiaryUser, underageBeneficiaryUser } from 'fixtures/user'
import { render, screen } from 'tests/utils'

const mockUseAuthContext = jest.fn().mockReturnValue({ isLoggedIn: false, user: undefined })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

describe('<UnderageBlockDescription />', () => {
  it('should display "Tu as 1 an pour activer ton crédit" when user is not logged in', () => {
    render(<UnderageBlockDescription />)

    expect(screen.getByText('Tu as 1 an pour activer ton crédit.')).toBeOnTheScreen()
  })

  it('should display "Tu as 1 an pour activer ton crédit" when user is logged in but not beneficiary', () => {
    mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true, user: nonBeneficiaryUser })
    render(<UnderageBlockDescription />)

    expect(screen.getByText('Tu as 1 an pour activer ton crédit.')).toBeOnTheScreen()
  })

  it('should not display "Tu as 1 an pour activer ton crédit" when user is already logged in and beneficiary', () => {
    mockUseAuthContext.mockReturnValueOnce({
      isLoggedIn: true,
      user: { ...underageBeneficiaryUser, isBeneficiary: true },
    })
    render(<UnderageBlockDescription />)

    expect(screen.queryByText('Tu as 1 an pour activer ton crédit.')).not.toBeOnTheScreen()
  })
})
