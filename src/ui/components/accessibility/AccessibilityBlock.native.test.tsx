import React from 'react'

import { venueWithDetailedAccessibilityInfo } from 'features/venue/fixtures/venueWithDetailedAccessibilityInfo'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils'

import { AccessibilityBlock } from './AccessibilityBlock'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('AccessibilityBlock', () => {
  it('should display AccesLibre banner when url is provided and enableAccesLibre FF activated', () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)

    render(
      <AccessibilityBlock
        detailedAccessibilityUrl={venueWithDetailedAccessibilityInfo.externalAccessibilityUrl}
      />
    )

    expect(screen.getByTestId('BasicAccessibilityInfo')).toBeOnTheScreen()
  })

  it('should not display AccesLibre banner when url is provided and enableAccesLibre FF deactivated', () => {
    render(
      <AccessibilityBlock
        detailedAccessibilityUrl={venueWithDetailedAccessibilityInfo.externalAccessibilityUrl}
      />
    )

    expect(screen.queryByTestId('BasicAccessibilityInfo')).not.toBeOnTheScreen()
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

    expect(
      screen.getByText(
        'Tu peux retrouver des informations supplémentaires sur l’accessibilité de ce lieu sur le site d’acceslibre.'
      )
    ).toBeOnTheScreen()
  })

  it('should display nothing when basicAccessibility is not provided', () => {
    render(<AccessibilityBlock />)

    expect(screen.queryByTestId('BasicAccessibilityInfo')).not.toBeOnTheScreen()
  })
})
