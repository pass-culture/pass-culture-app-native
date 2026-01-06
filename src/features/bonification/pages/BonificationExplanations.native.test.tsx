import React from 'react'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { BonificationExplanations } from 'features/bonification/pages/BonificationExplanations'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen, userEvent } from 'tests/utils'

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
})
