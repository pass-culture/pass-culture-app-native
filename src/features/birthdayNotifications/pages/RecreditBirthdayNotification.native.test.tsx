import mockdate from 'mockdate'
import React from 'react'

import { underageBeneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { RecreditBirthdayNotification } from './RecreditBirthdayNotification'

jest.mock('features/auth/context/AuthContext')
jest.mock('features/profile/api/useUpdateProfileMutation', () => ({
  useResetRecreditAmountToShow: jest.fn().mockReturnValue({
    mutate: jest.fn(),
  }),
}))

const birthdate = new Date('2006-10-11')

mockAuthContextWithUser({
  ...underageBeneficiaryUser,
  birthDate: birthdate.toISOString(),
  recreditAmountToShow: 5000,
  domainsCredit: {
    all: {
      initial: 5000,
      remaining: 5000,
    },
  },
})

describe('<RecreditBirthdayNotification />', () => {
  beforeAll(() => {
    mockdate.set(new Date('2023-02-28'))
  })

  it('should have correct text', async () => {
    render(reactQueryProviderHOC(<RecreditBirthdayNotification />))

    const recreditText = screen.getByText(
      'Pour tes 16 ans, 50\u00a0€ ont été ajoutés à ton compte. Tu disposes maintenant de :'
    )

    expect(recreditText).toBeOnTheScreen()
  })
})
