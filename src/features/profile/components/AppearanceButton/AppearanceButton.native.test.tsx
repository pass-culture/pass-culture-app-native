import React from 'react'

import { render, screen, userEvent } from 'tests/utils'

import { AppearanceButton } from './AppearanceButton'

jest.mock('libs/firebase/analytics/analytics')

const mockNavigate = jest.fn()

const user = userEvent.setup()
jest.useFakeTimers()

describe('AppearanceButton', () => {
  it('should render the button', () => {
    render(<AppearanceButton navigate={mockNavigate} />)

    expect(screen.getByText('Apparence')).toBeTruthy()
    expect(screen.queryByText('Nouveau')).toBeNull()
  })

  it('should navigate on press', async () => {
    render(<AppearanceButton navigate={mockNavigate} />)

    await user.press(screen.getByText('Apparence'))

    expect(mockNavigate).toHaveBeenCalledWith('ProfileStackNavigator', { screen: 'Appearance' })
  })
})
