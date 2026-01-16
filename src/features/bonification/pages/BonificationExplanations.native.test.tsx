import React from 'react'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { CurrencyEnum } from 'api/gen'
import { BonificationExplanations } from 'features/bonification/pages/BonificationExplanations'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/firebase/analytics/analytics')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('BonificationExplanations', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('Should navigate to form when pressing "Continuer"', async () => {
    render(<BonificationExplanations />)

    const button = screen.getByText('Continuer')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'BonificationRequiredInformation',
    })
  })

  it('Should navigate to CAF when pressing "Plus d’infos sur le quotient familial"', async () => {
    render(<BonificationExplanations />)

    const button = screen.getByText('Plus d’infos sur le quotient familial')
    await userEvent.press(button)

    expect(openUrl).toHaveBeenCalledWith(
      'https://www.caf.fr/allocataires/actualites/actualites-nationales/comment-obtenir-son-quotient-familial-qf',
      undefined,
      true
    )
  })

  it('Should go back when pressing go back button', async () => {
    render(<BonificationExplanations />)

    const button = screen.getByLabelText('Revenir en arrière')
    await userEvent.press(button)

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it('Should show banner to users with euro currency', async () => {
    render(<BonificationExplanations />)

    expect(screen.getByText('Si ce n’est pas ton cas, ta demande sera refusée.')).toBeTruthy()
  })

  it('Should show banner to users with pacific franc currency', async () => {
    mockAuthContextWithUser({
      ...beneficiaryUser,
      currency: CurrencyEnum.XPF,
    })

    render(<BonificationExplanations />)

    expect(
      screen.getByText(
        'Si tu habites en Nouvelle-Calédonie, tu ne pourras malheureusement pas bénéficier du bonus.'
      )
    ).toBeTruthy()
  })
})
