import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { BonificationType } from 'features/bonification/enums'
import { BonificationDisabilityRefused } from 'features/bonification/pages/BonificationDisabilityRefused'
import { BonificationDisabilityRefusedType } from 'features/bonification/types/BonificationRefusedType'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen, userEvent } from 'tests/utils'

describe('BonificationDisabilityRefused', () => {
  beforeEach(() => {
    setFeatureFlags([])
    jest.clearAllMocks()
  })

  describe('Application not found', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({
        params: {
          bonificationRefusedType: BonificationDisabilityRefusedType.APPLICATION_NOT_FOUND,
        },
      })
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

    it('should disable "Renouveler ma demande" button when feature flag is enabled', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.DISABLE_HANDICAP_BONIFICATION_MANUAL_REQUEST])

      render(<BonificationDisabilityRefused />)

      const button = screen.getByText('Renouveler ma demande')

      expect(button).toBeDisabled()
    })
  })

  describe('Too many retries', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({
        params: { bonificationRefusedType: BonificationDisabilityRefusedType.TOO_MANY_RETRIES },
      })
    })

    it('should disable "Renouveler ma demande" button', () => {
      render(<BonificationDisabilityRefused />)

      const button = screen.getByText('Renouveler ma demande')

      expect(button).toBeDisabled()
    })
  })
})
