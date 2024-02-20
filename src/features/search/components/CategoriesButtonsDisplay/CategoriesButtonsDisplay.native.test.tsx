import React from 'react'

import { CategoriesButtonsDisplay } from 'features/search/components/CategoriesButtonsDisplay/CategoriesButtonsDisplay'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place'
import { render, screen } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

const mockedPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

let mockHasGeolocPosition = true
let mockSelectedLocationMode = LocationMode.AROUND_ME
jest.mock('libs/location', () => ({
  useLocation: jest.fn(() => ({
    hasGeolocPosition: mockHasGeolocPosition,
    selectedLocationMode: mockSelectedLocationMode,
    place: mockedPlace,
  })),
}))

describe('CategoriesButtonsDisplay', () => {
  afterEach(() => {
    mockHasGeolocPosition = true
    mockSelectedLocationMode = LocationMode.AROUND_ME
  })

  it('should display venue map block when geoloc position is activated and location mode is set to "around me"', () => {
    mockHasGeolocPosition = true
    mockSelectedLocationMode = LocationMode.AROUND_ME
    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.getByText('Explorer les lieux')).toBeOnTheScreen()
  })

  it('should display venue map block when geoloc position is activated and location mode is set to "around place"', () => {
    mockHasGeolocPosition = true
    mockSelectedLocationMode = LocationMode.AROUND_PLACE
    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.getByText('Explorer les lieux')).toBeOnTheScreen()
  })

  it('should display venue map block when geoloc position is deactivated and location mode is set to "around place"', () => {
    mockHasGeolocPosition = false
    mockSelectedLocationMode = LocationMode.AROUND_PLACE
    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.getByText('Explorer les lieux')).toBeOnTheScreen()
  })

  it('should not display venue map block when feature flag is deactivated', () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
  })

  it("should not display venue map block when we don't have geoloc position", () => {
    mockHasGeolocPosition = false
    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
  })

  it('should not display venue map block when the location is to everywhere position', () => {
    mockSelectedLocationMode = LocationMode.EVERYWHERE
    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.queryByText('Explorer les lieux')).not.toBeOnTheScreen()
  })
})
