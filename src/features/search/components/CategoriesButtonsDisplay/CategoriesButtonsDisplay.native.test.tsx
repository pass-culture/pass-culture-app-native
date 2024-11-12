import React from 'react'

import { CategoriesButtonsDisplay } from 'features/search/components/CategoriesButtonsDisplay/CategoriesButtonsDisplay'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { fireEvent, render, screen } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

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
  onModalHideRef: jest.fn(),
}))
jest.mock('libs/location', () => ({
  useLocation: () => mockUseLocation(),
}))

const mockShowModal = jest.fn()
const useModalAPISpy = jest.spyOn(useModalAPI, 'useModal')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('CategoriesButtonsDisplay', () => {
  it('should display venue map block when geoloc position is activated and location mode is set to "around me"', async () => {
    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
  })

  it('should display venue map block when geoloc position is activated and location mode is set to "around place"', () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: true,
      selectedLocationMode: LocationMode.AROUND_PLACE,
      place: mockedPlace,
      onModalHideRef: jest.fn(),
    })

    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
  })

  it('should display venue map block when geoloc position is deactivated and location mode is set to "around place"', () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: false,
      selectedLocationMode: LocationMode.AROUND_PLACE,
      place: mockedPlace,
      onModalHideRef: jest.fn(),
    })

    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
  })

  it('should not display venue map block when feature flag is deactivated', () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.queryByText('Explore la carte')).not.toBeOnTheScreen()
  })

  it("should not display venue map block when we don't have geoloc position", () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: false,
      selectedLocationMode: LocationMode.AROUND_ME,
      place: mockedPlace,
      onModalHideRef: jest.fn(),
    })

    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.queryByText('Explore la carte')).not.toBeOnTheScreen()
  })

  it('should display venue map block when the location is to everywhere position', () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: true,
      selectedLocationMode: LocationMode.EVERYWHERE,
      place: mockedPlace,
      onModalHideRef: jest.fn(),
    })

    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
  })

  it('should display venue map block when the location is to everywhere position and feature flag wipVenueMap is activated', () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: false,
      selectedLocationMode: LocationMode.EVERYWHERE,
      place: mockedPlace,
      onModalHideRef: jest.fn(),
    })

    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
  })

  it('should log consult venue map from search landing when pressing venue map block', () => {
    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    fireEvent.press(screen.getByText('Explore la carte'))

    expect(analytics.logConsultVenueMap).toHaveBeenNthCalledWith(1, { from: 'searchLanding' })
  })

  it('should open venue map location modal when pressing on venue map block', () => {
    useModalAPISpy.mockReturnValueOnce({
      visible: false,
      showModal: mockShowModal,
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: false,
      selectedLocationMode: LocationMode.EVERYWHERE,
      place: mockedPlace,
      onModalHideRef: jest.fn(),
    })

    render(<CategoriesButtonsDisplay sortedCategories={[]} />)

    fireEvent.press(screen.getByText('Explore la carte'))

    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })
})
