import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { BonificationType } from 'features/bonification/enums'
import { BonificationDisabilityRefused } from 'features/bonification/pages/BonificationDisabilityRefused'
import { BonificationDisabilityRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { render, screen, userEvent } from 'tests/utils'

describe('BonificationDisabilityRefused', () => {
  describe('Application not found', () => {
    useRoute.mockReturnValueOnce({
      params: { bonificationRefusedType: BonificationDisabilityRefusedType.APPLICATION_NOT_FOUND },
    })

    it('should go navigate to BonificationRequiredInformation when pressing "Renouveler ma demande" button', async () => {
      render(<BonificationDisabilityRefused />)

      const button = screen.getByText('Renouveler ma demande')
      await userEvent.press(button)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: { bonificationType: BonificationType.DISABILITY },
        screen: 'BonificationRequiredInformation',
      })
    })
  })

  describe('Too many retries', () => {
    useRoute.mockReturnValueOnce({
      params: { bonificationRefusedType: BonificationDisabilityRefusedType.TOO_MANY_RETRIES },
    })

    it('should hide "Renouveler ma demande" button', async () => {
      render(<BonificationDisabilityRefused />)

      const button = screen.getByText('Renouveler ma demande')

      expect(button).toBeDisabled()
    })
  })
})
