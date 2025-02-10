import mockdate from 'mockdate'
import React from 'react'

import { underageBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockSettings } from 'tests/mockSettings'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { RecreditBirthdayNotification } from './RecreditBirthdayNotification'

jest.mock('features/auth/context/AuthContext')
jest.mock('features/profile/api/useUpdateProfileMutation', () => ({
  useResetRecreditAmountToShow: jest.fn().mockReturnValue({ mutate: jest.fn() }),
}))

const birthdate = new Date('2006-10-11')

mockAuthContextWithUser({
  ...underageBeneficiaryUser,
  birthDate: birthdate.toISOString(),
  recreditAmountToShow: 5000,
  domainsCredit: { all: { initial: 5000, remaining: 5000 } },
})

describe('<RecreditBirthdayNotification />', () => {
  beforeAll(() => {
    mockdate.set(new Date('2023-02-28'))
  })

  beforeEach(() => {
    setFeatureFlags()
    mockSettings()
  })

  it('should have correct credit text', async () => {
    render(reactQueryProviderHOC(<RecreditBirthdayNotification />))

    const recreditText = screen.getByText(
      'Pour tes 16 ans, 50\u00a0€ ont été ajoutés à ton compte. Tu disposes maintenant de :'
    )

    expect(recreditText).toBeOnTheScreen()
  })

  it('should have correct credit information text', async () => {
    render(reactQueryProviderHOC(<RecreditBirthdayNotification />))

    const recreditText = screen.getByText(
      'Tu as jusqu’à la veille de tes 18 ans pour profiter de ton crédit.'
    )

    expect(recreditText).toBeOnTheScreen()
  })

  describe('when enableCreditV3 activated', () => {
    beforeEach(() => {
      mockSettings({ wipEnableCreditV3: true })
    })

    it('should have correct credit information text', async () => {
      render(reactQueryProviderHOC(<RecreditBirthdayNotification />))

      const recreditText = screen.getByText(
        'Tu as jusqu’à la veille de tes 21 ans pour utiliser tout ton crédit.'
      )

      expect(recreditText).toBeOnTheScreen()
    })
  })
})
