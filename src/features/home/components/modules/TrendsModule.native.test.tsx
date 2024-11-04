import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { TrendsModule } from 'features/home/components/modules/TrendsModule'
import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { render, screen, userEvent } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

const trackingProps = {
  index: 1,
  homeEntryId: '4Fs4egA8G2z3fHgU2XQj3h',
  moduleId: formattedTrendsModule.id,
}
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

const mockRemoveSelectedVenue = jest.fn()
jest.mock('features/venueMap/store/selectedVenueStore', () => ({
  useSelectedVenueActions: () => ({
    removeSelectedVenue: mockRemoveSelectedVenue,
  }),
}))

const mockShowModal = jest.fn()
const useModalAPISpy = jest.spyOn(useModalAPI, 'useModal')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

const user = userEvent.setup()

jest.useFakeTimers()

describe('TrendsModule', () => {
  it('should not log analytics on render when FF is disabled', () => {
    render(<TrendsModule {...formattedTrendsModule} {...trackingProps} />)

    expect(analytics.logModuleDisplayedOnHomepage).not.toHaveBeenCalled()
  })

  it('should log analytics on render when FF is enabled', () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    const trackingPropsWithoutRedesign = {
      ...trackingProps,
      homeEntryId: 'homeEntryId',
    }
    render(<TrendsModule {...formattedTrendsModule} {...trackingPropsWithoutRedesign} />)

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenCalledWith({
      moduleId: 'g6VpeYbOosfALeqR55Ah6',
      moduleType: 'trends',
      index: 1,
      homeEntryId: 'homeEntryId',
    })
  })

  it('should redirect to VenueMap when pressing venue map block content type and user location is not everywhere', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    render(<TrendsModule {...formattedTrendsModule} {...trackingProps} />)

    await user.press(screen.getByText('Accès carte des lieux'))

    expect(navigate).toHaveBeenCalledWith('VenueMap', undefined)
  })

  it('should reset selected venue in store when pressing venue map block content type and user location is not everywhere', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    render(<TrendsModule {...formattedTrendsModule} {...trackingProps} />)

    await user.press(screen.getByText('Accès carte des lieux'))

    expect(mockRemoveSelectedVenue).toHaveBeenCalledTimes(1)
  })

  it('should open venue map location modal when pressing venue map block content type and user location is everywhere', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    useModalAPISpy.mockReturnValueOnce({
      visible: false,
      showModal: mockShowModal,
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: true,
      selectedLocationMode: LocationMode.EVERYWHERE,
      place: mockedPlace,
      onModalHideRef: jest.fn(),
    })
    render(<TrendsModule {...formattedTrendsModule} {...trackingProps} />)

    await user.press(screen.getByText('Accès carte des lieux'))

    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it('should redirect to thematic home when pressing trend block content type', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    render(<TrendsModule {...formattedTrendsModule} {...trackingProps} />)

    await user.press(screen.getByText('Tendance 1'))

    expect(navigate).toHaveBeenCalledWith('ThematicHome', {
      homeId: '7qcfqY5zFesLVO5fMb4cqm',
      moduleId: '16ZgVwnOXvVc0N8ko9Kius',
      from: 'trend_block',
    })
  })

  it('should log analytics when pressing venue map block content type and user location is not everywhere', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)

    render(<TrendsModule {...formattedTrendsModule} {...trackingProps} />)

    await user.press(screen.getByText('Accès carte des lieux'))

    expect(analytics.logConsultVenueMap).toHaveBeenNthCalledWith(1, { from: 'trend_block' })
  })

  it('should not log analytics when pressing venue map block content type and user location is everywhere', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    useModalAPISpy.mockReturnValueOnce({
      visible: false,
      showModal: mockShowModal,
      hideModal: jest.fn(),
      toggleModal: jest.fn(),
    })
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: true,
      selectedLocationMode: LocationMode.EVERYWHERE,
      place: mockedPlace,
      onModalHideRef: jest.fn(),
    })
    render(<TrendsModule {...formattedTrendsModule} {...trackingProps} />)

    await user.press(screen.getByText('Accès carte des lieux'))

    expect(analytics.logConsultVenueMap).not.toHaveBeenCalled()
  })

  it('should log trends block clicked when pressing a trend', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    render(<TrendsModule {...formattedTrendsModule} {...trackingProps} />)

    await user.press(screen.getByText('Tendance 1'))

    expect(analytics.logTrendsBlockClicked).toHaveBeenCalledWith({
      moduleListID: 'g6VpeYbOosfALeqR55Ah6',
      entryId: '4Fs4egA8G2z3fHgU2XQj3h',
      moduleId: '16ZgVwnOXvVc0N8ko9Kius',
      toEntryId: '7qcfqY5zFesLVO5fMb4cqm',
    })
  })

  it('should log trends block clicked when pressing venue map block content type', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    render(<TrendsModule {...formattedTrendsModule} {...trackingProps} />)

    await user.press(screen.getByText('Accès carte des lieux'))

    expect(analytics.logTrendsBlockClicked).toHaveBeenCalledWith({
      moduleListID: 'g6VpeYbOosfALeqR55Ah6',
      entryId: '4Fs4egA8G2z3fHgU2XQj3h',
      moduleId: '6dn0unOv4tRBNfOebVHOOy',
      toEntryId: '7qcfqY5zFesLVO5fMb4cqm',
    })
  })
})
