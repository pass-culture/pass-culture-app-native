import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ErrorBonificationBanner } from 'features/bonification/components/ErrorBonificationBanner'
import { BonificationRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { render, screen, userEvent } from 'tests/utils'

const defaultProps = {
  amount: '30€',
  onClose: jest.fn(),
  refusedType: BonificationRefusedType.TOO_MANY_RETRIES,
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('ErrorBonificationBanner', () => {
  it('should navigate to BonificationRefused when pressing "Voir plus de détails"', async () => {
    render(<ErrorBonificationBanner {...defaultProps} />)

    const button = screen.getByText('Voir plus de détails')
    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      screen: 'BonificationRefused',
      params: { bonificationRefusedType: BonificationRefusedType.TOO_MANY_RETRIES },
    })
  })

  it('should display "Voir plus de détails" button when FF disable', () => {
    render(<ErrorBonificationBanner {...defaultProps} />)

    const button = screen.getByText('Voir plus de détails')

    expect(button).toBeOnTheScreen()
  })
})
