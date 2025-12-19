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

  it('Should navigate to FAQ when pressing "Consulter l’article d’aide"', async () => {
    render(<BonificationRequiredInformation />)

    const button = screen.getByText('Consulter l’article d’aide')
    await userEvent.press(button)

    expect(openUrl).toHaveBeenCalledWith('https://passculture.faq', undefined, true)
  })

  it('Should go back when pressing go back button', async () => {
    render(<BonificationRequiredInformation />)

    const button = screen.getByLabelText('Revenir en arrière')
    await userEvent.press(button)

    expect(goBack).toHaveBeenCalledTimes(1)
  })
})
