import React from 'react'

import { VenueMapModule } from 'features/home/components/modules/VenueMapModule'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { fireEvent, render, screen } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

const mockedPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

const mockHasGeolocPosition = true
const mockSelectedLocationMode = LocationMode.AROUND_ME

const mockUseLocation = jest.fn(() => ({
  hasGeolocPosition: mockHasGeolocPosition,
  selectedLocationMode: mockSelectedLocationMode,
  place: mockedPlace,
}))
jest.mock('libs/location', () => ({
  useLocation: () => mockUseLocation(),
}))

describe('VenueMapModule', () => {
  it('should render venue map block when user is located and feature flag enabled', () => {
    render(<VenueMapModule />)

    expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
  })

  it('should not render venue map block when feature flag is disabled', () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    render(<VenueMapModule />)

    expect(screen.queryByText('Carte des lieux culturels')).not.toBeOnTheScreen()
  })

  it('should not render venue map block when user is not located', () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: false,
      selectedLocationMode: mockSelectedLocationMode,
      place: mockedPlace,
    })
    render(<VenueMapModule />)

    expect(screen.queryByText('Carte des lieux culturels')).not.toBeOnTheScreen()
  })

  it('should not render venue map block when user is located everywhere', () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: mockHasGeolocPosition,
      selectedLocationMode: LocationMode.EVERYWHERE,
      place: mockedPlace,
    })
    render(<VenueMapModule />)

    expect(screen.queryByText('Carte des lieux culturels')).not.toBeOnTheScreen()
  })

  it('should log consult venue map from home when pressing venue map block', () => {
    render(<VenueMapModule />)

    fireEvent.press(screen.getByText('Explore la carte'))

    expect(analytics.logConsultVenueMap).toHaveBeenNthCalledWith(1, { from: 'home' })
  })
})
