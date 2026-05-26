import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { render, screen, userEvent } from 'tests/utils'

import { AppearanceButton } from './AppearanceButton'

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('AppearanceButton', () => {
  it('should render the button', () => {
    render(<AppearanceButton />)

    expect(screen.getByText('Apparence')).toBeTruthy()
    expect(screen.queryByText('Nouveau')).toBeNull()
  })

  it('should navigate on press', async () => {
    render(<AppearanceButton />)

    await user.press(screen.getByText('Apparence'))

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', { screen: 'Appearance' })
  })
})
