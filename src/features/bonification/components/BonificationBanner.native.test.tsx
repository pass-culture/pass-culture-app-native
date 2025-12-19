import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { QFBonificationStatus } from 'api/gen'
import { BonificationBanner } from 'features/bonification/components/BonificationBanner'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
setFeatureFlags([]) // After adding "navigate" in test, setFeatureFlag is required or else: "TypeError: docSnapshot.get is not a function" (maybe a FF is used in navigation?)

describe('BonificationBanner', () => {
  it('should show default banner', () => {
    render(
      reactQueryProviderHOC(
        <BonificationBanner
          bonificationStatus={QFBonificationStatus.eligible}
          onCloseCallback={jest.fn()}
        />
      )
    )

    const bannerLabel = screen.getByText(
      'Un bonus de 50 € pourrait t’être attribué, voyons si tu peux y être éligible.'
    )

    expect(bannerLabel).toBeOnTheScreen()
  })

  describe('error banner', () => {
    it('should show correct message', () => {
      render(
        reactQueryProviderHOC(
          <BonificationBanner
            bonificationStatus={QFBonificationStatus.custodian_not_found}
            onCloseCallback={jest.fn()}
          />
        )
      )

      const bannerLabel = screen.getByText('Ton dossier a été refusé.')

      expect(bannerLabel).toBeOnTheScreen()
    })

    it('should navigate with correct params when custodian_not_found', async () => {
      render(
        reactQueryProviderHOC(
          <BonificationBanner
            bonificationStatus={QFBonificationStatus.custodian_not_found}
            onCloseCallback={jest.fn()}
          />
        )
      )

      const bannerLink = screen.getByText('Voir plus de détails')

      await userEvent.press(bannerLink)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: { bonificationRefusedType: 'custodian_not_found' },
        screen: 'BonificationRefused',
      })
    })

    it('should navigate with correct params when too_many_retries', async () => {
      render(
        reactQueryProviderHOC(
          <BonificationBanner
            bonificationStatus={QFBonificationStatus.too_many_retries}
            onCloseCallback={jest.fn()}
          />
        )
      )

      const bannerLink = screen.getByText('Voir plus de détails')

      await userEvent.press(bannerLink)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: { bonificationRefusedType: 'too_many_retries' },
        screen: 'BonificationRefused',
      })
    })
  })

  it('should show pending banner', () => {
    render(
      reactQueryProviderHOC(
        <BonificationBanner
          bonificationStatus={QFBonificationStatus.started}
          onCloseCallback={jest.fn()}
        />
      )
    )

    const bannerLabel = screen.getByText(
      'Dossier en cours de vérification. On te notifiera rapidement.'
    )

    expect(bannerLabel).toBeOnTheScreen()
  })
})
