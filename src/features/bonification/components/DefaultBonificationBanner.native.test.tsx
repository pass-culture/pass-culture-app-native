import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { DefaultBonificationBanner } from 'features/bonification/components/DefaultBonificationBanner'
import { render, screen, userEvent } from 'tests/utils'

const defaultProps = { amount: '30€', onClose: jest.fn() }

const user = userEvent.setup()
jest.useFakeTimers()

describe('DefaultBonificationBanner', () => {
  it('should navigate to BonificationExplanations when pressing "Vérifier maintenant"', async () => {
    render(<DefaultBonificationBanner {...defaultProps} />)

    const button = screen.getByText('Vérifier maintenant')
    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      screen: 'BonificationExplanations',
    })
  })
})
