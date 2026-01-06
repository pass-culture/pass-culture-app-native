import React from 'react'

import { goBack, navigate } from '__mocks__/@react-navigation/native'
import { BonificationRequiredInformation } from 'features/bonification/pages/BonificationRequiredInformation'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('BonificationRequiredInformation', () => {
  it('Should navigate to form when pressing "Commencer"', async () => {
    render(<BonificationRequiredInformation />)

    const button = screen.getByText('Commencer')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      params: undefined,
      screen: 'BonificationNames',
    })
  })

  it('Should navigate to bonification FAQ when pressing "Consulter l’article d’aide"', async () => {
    render(<BonificationRequiredInformation />)

    const button = screen.getByText('Consulter l’article d’aide')
    await userEvent.press(button)

    expect(openUrl).toHaveBeenCalledWith(
      'https://aide.passculture.app/hc/fr/articles/24338766387100-FAQ-Bonif',
      undefined,
      true
    )
  })

  it('Should navigate to personal data chart when pressing "notre charte dédiée"', async () => {
    render(<BonificationRequiredInformation />)

    const button = screen.getByText('notre charte dédiée')
    await userEvent.press(button)

    expect(openUrl).toHaveBeenCalledWith('https://passculture.data-privacy-chart', undefined, true)
  })

  it('Should go back when pressing go back button', async () => {
    render(<BonificationRequiredInformation />)

    const button = screen.getByLabelText('Revenir en arrière')
    await userEvent.press(button)

    expect(goBack).toHaveBeenCalledTimes(1)
  })
})
