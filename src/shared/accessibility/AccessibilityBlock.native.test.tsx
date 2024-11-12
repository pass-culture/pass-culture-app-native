import React from 'react'

import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils'

import { AccessibilityBlock } from './AccessibilityBlock'

jest.mock('libs/firebase/analytics/analytics')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('AccessibilityBlock', () => {
  it('should display AccesLibre banner when url is provided and enableAccesLibre FF activated', () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)

    render(
      <AccessibilityBlock
        detailedAccessibilityUrl={venueDataTest.externalAccessibilityUrl}
        detailedAccessibilityData={venueDataTest.externalAccessibilityData}
        detailedAccessibilityId={venueDataTest.externalAccessibilityId}
      />
    )

    expect(
      screen.getByText(
        'Tu peux retrouver des informations supplémentaires sur l’accessibilité de ce lieu sur le site d’acceslibre.'
      )
    ).toBeOnTheScreen()
  })

  it('should not display AccesLibre banner when url is provided and enableAccesLibre FF deactivated', () => {
    render(
      <AccessibilityBlock
        detailedAccessibilityUrl={venueDataTest.externalAccessibilityUrl}
        detailedAccessibilityData={venueDataTest.externalAccessibilityData}
        detailedAccessibilityId={venueDataTest.externalAccessibilityId}
      />
    )

    expect(
      screen.queryByText(
        'Tu peux retrouver des informations supplémentaires sur l’accessibilité de ce lieu sur le site d’acceslibre.'
      )
    ).not.toBeOnTheScreen()
  })

  it('should display BasicAccessibilityInfo when basicAccessibility is provided', () => {
    render(
      <AccessibilityBlock
        basicAccessibility={{
          audioDisability: true,
          motorDisability: false,
          mentalDisability: true,
          visualDisability: false,
        }}
      />
    )

    expect(screen.getByTestId('BasicAccessibilityInfo')).toBeOnTheScreen()
  })

  it('should display nothing when basicAccessibility is not provided', () => {
    render(<AccessibilityBlock />)

    expect(screen.queryByTestId('BasicAccessibilityInfo')).not.toBeOnTheScreen()
  })
})
