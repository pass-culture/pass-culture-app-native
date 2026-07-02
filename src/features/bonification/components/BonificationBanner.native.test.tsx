import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { QFBonificationStatus } from 'api/gen'
import { BonificationBanner } from 'features/bonification/components/BonificationBanner'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

describe('BonificationBanner', () => {
  beforeEach(() => setFeatureFlags([]))

  describe('default banner', () => {
    it('should show banner', () => {
      render(
        reactQueryProviderHOC(
          <BonificationBanner
            bonificationStatus={QFBonificationStatus.eligible}
            onCloseCallback={jest.fn()}
          />
        )
      )

      const bannerLabel = screen.getByLabelText(
        'Bonus de 50 € - Tu es peut-être éligible à ce bonus, vérifie si tu y as droit.'
      )

      expect(bannerLabel).toBeOnTheScreen()
    })

    it('should hide banner when feature flag is enabled', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.DISABLE_QF_BONIFICATION_MANUAL_REQUEST])
      render(
        <BonificationBanner
          bonificationStatus={QFBonificationStatus.eligible}
          onCloseCallback={jest.fn()}
        />
      )
      const bannerLabel = screen.queryByText(
        'Bonus de 50 € - Tu es peut-être éligible à ce bonus, vérifie si tu y as droit.'
      )

      expect(bannerLabel).not.toBeOnTheScreen()
    })
  })

  describe('pending banner', () => {
    it('should show banner when started', () => {
      render(
        reactQueryProviderHOC(
          <BonificationBanner
            bonificationStatus={QFBonificationStatus.started}
            onCloseCallback={jest.fn()}
          />
        )
      )

      const bannerLabel = screen.getByLabelText(
        'Bonus de 50 € - Ton dossier est actuellement en cours de vérification.'
      )

      expect(bannerLabel).toBeOnTheScreen()
    })
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

    it('should show correct message when application_not_found', () => {
      render(
        reactQueryProviderHOC(
          <BonificationBanner
            bonificationStatus={QFBonificationStatus.application_not_found}
            onCloseCallback={jest.fn()}
          />
        )
      )

      const bannerLabel = screen.getByText('Ton dossier a été refusé.')

      expect(bannerLabel).toBeOnTheScreen()
    })

    it('should navigate with correct params when application_not_found', async () => {
      render(
        reactQueryProviderHOC(
          <BonificationBanner
            bonificationStatus={QFBonificationStatus.application_not_found}
            onCloseCallback={jest.fn()}
          />
        )
      )

      const bannerLink = screen.getByText('Voir plus de détails')

      await userEvent.press(bannerLink)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: { bonificationRefusedType: 'application_not_found' },
        screen: 'BonificationRefused',
      })
    })

    it('should show correct message when quotient_familial_too_high', () => {
      render(
        reactQueryProviderHOC(
          <BonificationBanner
            bonificationStatus={QFBonificationStatus.quotient_familial_too_high}
            onCloseCallback={jest.fn()}
          />
        )
      )

      const bannerLabel = screen.getByText('Ton dossier a été refusé.')

      expect(bannerLabel).toBeOnTheScreen()
    })

    it('should navigate with correct params when quotient_familial_too_high', async () => {
      render(
        reactQueryProviderHOC(
          <BonificationBanner
            bonificationStatus={QFBonificationStatus.quotient_familial_too_high}
            onCloseCallback={jest.fn()}
          />
        )
      )

      const bannerLink = screen.getByText('Voir plus de détails')

      await userEvent.press(bannerLink)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: { bonificationRefusedType: 'quotient_familial_too_high' },
        screen: 'BonificationRefused',
      })
    })

    it('should show correct message when not_in_tax_household', () => {
      render(
        reactQueryProviderHOC(
          <BonificationBanner
            bonificationStatus={QFBonificationStatus.not_in_tax_household}
            onCloseCallback={jest.fn()}
          />
        )
      )

      const bannerLabel = screen.getByText('Ton dossier a été refusé.')

      expect(bannerLabel).toBeOnTheScreen()
    })

    it('should navigate with correct params when not_in_tax_household', async () => {
      render(
        reactQueryProviderHOC(
          <BonificationBanner
            bonificationStatus={QFBonificationStatus.not_in_tax_household}
            onCloseCallback={jest.fn()}
          />
        )
      )

      const bannerLink = screen.getByText('Voir plus de détails')

      await userEvent.press(bannerLink)

      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: { bonificationRefusedType: 'not_in_tax_household' },
        screen: 'BonificationRefused',
      })
    })

    it('should show correct message when too_many_retries', () => {
      render(
        reactQueryProviderHOC(
          <BonificationBanner
            bonificationStatus={QFBonificationStatus.too_many_retries}
            onCloseCallback={jest.fn()}
          />
        )
      )

      const bannerLabel = screen.getByText('Ton dossier a été refusé.')

      expect(bannerLabel).toBeOnTheScreen()
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
})
