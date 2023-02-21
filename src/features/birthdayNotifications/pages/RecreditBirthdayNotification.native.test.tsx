import React from 'react'

import { IAuthContext, useAuthContext } from 'features/auth/context/AuthContext'
import { underageBeneficiaryUser } from 'fixtures/user'
import { flushAllPromisesWithAct, render } from 'tests/utils'

import { RecreditBirthdayNotification } from './RecreditBirthdayNotification'

jest.mock('react-query')
jest.mock('features/auth/context/AuthContext')
jest.mock('features/profile/api/useUpdateProfileMutation', () => ({
  useResetRecreditAmountToShow: jest.fn().mockReturnValue({
    mutate: jest.fn(),
  }),
}))

const birthdate = new Date()
birthdate.setFullYear(birthdate.getFullYear() - 15)

const UserMock = {
  ...underageBeneficiaryUser,
  dateOfBirth: birthdate.toISOString(),
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
  it('should have correct text', async () => {
    const { getByText } = render(<RecreditBirthdayNotification />)

    await flushAllPromisesWithAct()

    const recreditText = getByText(
      'Pour tes 15 ans, l’État vient d’ajouter 50\u00a0€ à ton crédit. Tu disposes maintenant de :'
    )

    expect(recreditText).toBeTruthy()
  })
})
