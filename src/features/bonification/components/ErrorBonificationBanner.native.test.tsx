import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { ErrorBonificationBanner } from 'features/bonification/components/ErrorBonificationBanner'
import { BonificationQFRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { render, screen, userEvent } from 'tests/utils'

const defaultProps = {
  amount: '30€',
  onClose: jest.fn(),
  refusedType: BonificationQFRefusedType.TOO_MANY_RETRIES,
}

const user = userEvent.setup()
jest.useFakeTimers()

describe('ErrorBonificationBanner', () => {
  it('should navigate to BonificationFamilyQuotientRefused when pressing "Voir plus de détails"', async () => {
    render(<ErrorBonificationBanner {...defaultProps} />)

    const button = screen.getByText('Voir plus de détails')
    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      screen: 'BonificationFamilyQuotientRefused',
      params: { bonificationRefusedType: BonificationQFRefusedType.TOO_MANY_RETRIES },
    })
  })
})
