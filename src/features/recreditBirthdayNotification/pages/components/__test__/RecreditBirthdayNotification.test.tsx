import React from 'react'

import { UserProfileResponse } from 'api/gen'
import { IAuthContext, useAuthContext } from 'features/auth/AuthContext'
import { flushAllPromisesWithAct, render } from 'tests/utils'

import { RecreditBirthdayNotification } from '../RecreditBirthdayNotification'

jest.mock('react-query')
jest.mock('features/auth/AuthContext')
jest.mock('features/profile/api', () => ({
  useUserProfileInfo: jest.fn(() => {
    const birthdate = new Date()
    birthdate.setFullYear(birthdate.getFullYear() - 15)
    return {
      data: {
        dateOfBirth: birthdate.toISOString(),
        recreditAmountToShow: 5000,
        domainsCredit: {
          all: {
            remaining: 5000,
          },
        },
      } as UserProfileResponse,
    }
  }),
  useResetRecreditAmountToShow: jest.fn().mockReturnValue({
    mutate: jest.fn(),
  }),
}))

const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

mockUseAuthContext.mockImplementation(() => ({ isLoggedIn: true } as IAuthContext))

describe('<RecreditBirthdayNotification />', () => {
  it('should have correct text', async () => {
    const { getByText } = render(<RecreditBirthdayNotification />)

    await flushAllPromisesWithAct()

    const recreditText = getByText(
      "Pour tes 15 ans, le Gouvernement vient d'ajouter 50\u00a0€ à ton crédit. Tu disposes maintenant de\u00a0:"
    )

    expect(recreditText).toBeTruthy()
  })
})
