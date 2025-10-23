import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { BonificationRefused } from 'features/bonification/pages/BonificationRefused'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationRefused', () => {
  it('should go navigate to home when pressing "Revenir à l’accueil"', async () => {
    render(<BonificationRefused />)

    const button = screen.getByText('Revenir à l’accueil')
    await userEvent.press(button)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', { params: undefined, screen: 'Home' })
  })
})
