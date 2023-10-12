import mockdate from 'mockdate'
import React from 'react'

import { IAuthContext, useAuthContext } from 'features/auth/context/AuthContext'
import { underageBeneficiaryUser } from 'fixtures/user'
import { render, screen } from 'tests/utils'

import { RecreditBirthdayNotification } from './RecreditBirthdayNotification'

jest.mock('react-query')
jest.mock('features/auth/context/AuthContext')
jest.mock('features/profile/api/useUpdateProfileMutation', () => ({
  useResetRecreditAmountToShow: jest.fn().mockReturnValue({
    mutate: jest.fn(),
  }),
}))

const birthdate = new Date('2006-10-11')

const UserMock = {
  ...underageBeneficiaryUser,
  birthDate: birthdate.toISOString(),
  recreditAmountToShow: 5000,
  domainsCredit: {
    all: {
      remaining: 5000,
    },
  },
}

const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
mockUseAuthContext.mockReturnValue({ isLoggedIn: true, user: UserMock } as IAuthContext)

describe('<RecreditBirthdayNotification />', () => {
  beforeAll(() => {
    mockdate.set(new Date('2023-02-28'))
  })

  it('should have correct text', async () => {
    render(<RecreditBirthdayNotification />)

    const recreditText = screen.getByText(
      'Pour tes 16 ans, 50\u00a0€ ont été ajoutés à ton compte. Tu disposes maintenant de :'
    )

    expect(recreditText).toBeOnTheScreen()
  })
})
