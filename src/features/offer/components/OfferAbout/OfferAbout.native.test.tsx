import React from 'react'

import { OfferResponseV2 } from 'api/gen'
import { OfferAbout } from 'features/offer/components/OfferAbout/OfferAbout'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('<OfferAbout />', () => {
  const metadata = [
    { label: 'Speaker', value: 'Donald' },
    { label: 'Author', value: 'Mickey' },
  ]

  it('should display about section', () => {
    render(
      <OfferAbout
        offer={offerResponseSnap}
        metadata={metadata}
        hasMetadata
        shouldDisplayAccessibilitySection
      />
    )

    expect(screen.getByText('À propos')).toBeOnTheScreen()
  })

  describe('Metadata', () => {
    it('should display metadata', () => {
      render(
        <OfferAbout
          offer={offerResponseSnap}
          metadata={metadata}
          hasMetadata
          shouldDisplayAccessibilitySection={false}
        />
      )

      expect(screen.getByText('Mickey')).toBeOnTheScreen()
    })

    it('should not display metadata', () => {
      render(
        <OfferAbout
          offer={offerResponseSnap}
          metadata={[]}
          hasMetadata={false}
          shouldDisplayAccessibilitySection={false}
        />
      )

      expect(screen.queryByText('Mickey')).not.toBeOnTheScreen()
    })
  })

  describe('Description', () => {
    it('should display description', () => {
      const offer: OfferResponseV2 = {
        ...offerResponseSnap,
        description: 'Cette offre est super cool cool cool cool cool cool',
      }

      render(
        <OfferAbout
          offer={offer}
          metadata={metadata}
          hasMetadata
          shouldDisplayAccessibilitySection
        />
      )

      expect(
        screen.getByText('Cette offre est super cool cool cool cool cool cool')
      ).toBeOnTheScreen()
    })

    it('should not display description when no description', () => {
      const offer: OfferResponseV2 = {
        ...offerResponseSnap,
        description: null,
      }
      render(
        <OfferAbout
          offer={offer}
          metadata={metadata}
          hasMetadata
          shouldDisplayAccessibilitySection
        />
      )

      expect(screen.queryByText('Description :')).not.toBeOnTheScreen()
    })
  })

  describe('Accessibility section', () => {
    it('should display accessibility when disabilities are defined', () => {
      render(
        <OfferAbout
          offer={offerResponseSnap}
          metadata={[]}
          hasMetadata={false}
          shouldDisplayAccessibilitySection
        />
      )

      expect(screen.getByText('Handicap visuel')).toBeOnTheScreen()
    })

    it('should not display accessibility when disabilities are not defined', () => {
      const offer: OfferResponseV2 = {
        ...offerResponseSnap,
        accessibility: {},
      }

      render(
        <OfferAbout
          offer={offer}
          metadata={[]}
          hasMetadata={false}
          shouldDisplayAccessibilitySection={false}
        />
      )

      expect(screen.queryByText('Handicap visuel')).not.toBeOnTheScreen()
      expect(screen.queryByText('Accessibilité de l’offre')).not.toBeOnTheScreen()
    })
  })
})
