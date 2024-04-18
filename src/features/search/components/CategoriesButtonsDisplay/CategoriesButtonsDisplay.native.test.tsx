import React from 'react'

import { CategoriesButtonsDisplay } from 'features/search/components/CategoriesButtonsDisplay/CategoriesButtonsDisplay'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { render, screen } from 'tests/utils'

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

describe('CategoriesButtonsDisplay', () => {
  it('should display venue map block when geoloc position is activated and location mode is set to "around me"', () => {
    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.getByText('Explorer les lieux')).toBeOnTheScreen()
  })

  it('should display venue map block when geoloc position is activated and location mode is set to "around place"', () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: mockHasGeolocPosition,
      selectedLocationMode: LocationMode.AROUND_PLACE,
      place: mockedPlace,
    })

    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.getByText('Explorer les lieux')).toBeOnTheScreen()
  })

  it('should display venue map block when geoloc position is deactivated and location mode is set to "around place"', () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: false,
      selectedLocationMode: LocationMode.AROUND_PLACE,
      place: mockedPlace,
    })

    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.getByText('Explorer les lieux')).toBeOnTheScreen()
  })

  it('should not display venue map block when feature flag is deactivated', () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
  })

  it("should not display venue map block when we don't have geoloc position", () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: false,
      selectedLocationMode: mockSelectedLocationMode,
      place: mockedPlace,
    })

    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
  })

  it('should not display venue map block when the location is to everywhere position', () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: mockHasGeolocPosition,
      selectedLocationMode: LocationMode.EVERYWHERE,
      place: mockedPlace,
    })

    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
  })
})
