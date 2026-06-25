import mockdate from 'mockdate'
import React from 'react'

import { reset, replace } from '__mocks__/@react-navigation/native'
import { RecreditType } from 'api/gen'
import { underageBeneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

import { RecreditBirthdayNotification } from './RecreditBirthdayNotification'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

const birthdate = new Date('2004-10-11')

describe('<RecreditBirthdayNotification />', () => {
  beforeAll(() => {
    mockdate.set(new Date('2023-02-28'))
  })

  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display good recreditAmountToShow', async () => {
    mockAuthContextWithUser({
      ...underageBeneficiaryUser,
      birthDate: birthdate.toISOString(),
      recreditAmountToShow: 15000,
    })

    renderRecreditBirthdayNotification()

    const recreditText = screen.getByText(
      'Pour tes 18 ans, 150\u00a0€ ont été ajoutés à ton compte.'
    )

    expect(recreditText).toBeOnTheScreen()
  })

  it('should display good recreditAmountToShow if recreditTypeToShow is BonusCredit', async () => {
    mockAuthContextWithUser({
      ...underageBeneficiaryUser,
      birthDate: birthdate.toISOString(),
      recreditTypeToShow: RecreditType.BonusCredit,
      recreditAmountToShow: 20000,
    })

    renderRecreditBirthdayNotification()

    const recreditText = screen.getByText(
      'Pour tes 18 ans, 150\u00a0€ ont été ajoutés à ton compte.'
    )

    expect(recreditText).toBeOnTheScreen()
  })

  describe('when pressing "Continuer"', () => {
    it('should reset to home when call to reset re-credit amount to show succeeds', async () => {
      mockServer.postApi('/v1/reset_recredit_amount_to_show', {
        responseOptions: { statusCode: 200, data: {} },
      })

      renderRecreditBirthdayNotification()

      const button = screen.getByText('Continuer')
      await userEvent.press(button)

      expect(reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'TabNavigator' }],
      })
    })

    it('should replace by BonificationGranted if recreditTypeToShow is BonusCredit', async () => {
      mockAuthContextWithUser({
        ...underageBeneficiaryUser,
        birthDate: birthdate.toISOString(),
        recreditTypeToShow: RecreditType.BonusCredit,
        recreditAmountToShow: 20000,
      })

      renderRecreditBirthdayNotification()

      const button = screen.getByText('Continuer')
      await userEvent.press(button)

      expect(replace).toHaveBeenNthCalledWith(1, 'BonificationGranted')
    })
  })
})

function renderRecreditBirthdayNotification() {
  return render(reactQueryProviderHOC(<RecreditBirthdayNotification />))
}
