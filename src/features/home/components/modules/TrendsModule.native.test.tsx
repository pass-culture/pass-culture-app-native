import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { TrendsModule } from 'features/home/components/modules/TrendsModule'
import { formattedTrendsModule } from 'features/home/fixtures/homepage.fixture'
import * as useVenueMapStore from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
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

const removeSelectedVenueSpy = jest.spyOn(useVenueMapStore, 'removeSelectedVenue')

const mockShowModal = jest.fn()
const useModalAPISpy = jest.spyOn(useModalAPI, 'useModal')

const user = userEvent.setup()
jest.useFakeTimers()

describe('TrendsModule', () => {
  beforeEach(() => setFeatureFlags())

  it('should log analytics on render', () => {
    const trackingPropsWithoutRedesign = {
      ...trackingProps,
      homeEntryId: 'homeEntryId',
    }
    render(
      reactQueryProviderHOC(
        <TrendsModule {...formattedTrendsModule} {...trackingPropsWithoutRedesign} />
      )
    )

    expect(analytics.logModuleDisplayedOnHomepage).toHaveBeenCalledWith({
      moduleId: 'g6VpeYbOosfALeqR55Ah6',
      moduleType: 'trends',
      index: 1,
      homeEntryId: 'homeEntryId',
    })
  })

  it('should redirect to VenueMap when pressing venue map block content type and user location is not everywhere', async () => {
    renderTrendsModule()

    await user.press(screen.getByText('Accès carte des lieux'))

    expect(navigate).toHaveBeenCalledWith('VenueMap', undefined)
  })

  it('should reset selected venue in store when pressing venue map block content type and user location is not everywhere', async () => {
    renderTrendsModule()

    await user.press(screen.getByText('Accès carte des lieux'))

    expect(removeSelectedVenueSpy).toHaveBeenCalledTimes(1)
  })

  it('should open venue map location modal when pressing venue map block content type and user location is everywhere', async () => {
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
    renderTrendsModule()

    await user.press(screen.getByText('Accès carte des lieux'))

    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it('should redirect to thematic home when pressing trend block content type', async () => {
    renderTrendsModule()

    await user.press(screen.getByText('Tendance 1'))

    expect(navigate).toHaveBeenCalledWith('ThematicHome', {
      homeId: '7qcfqY5zFesLVO5fMb4cqm',
      moduleId: '16ZgVwnOXvVc0N8ko9Kius',
      from: 'trend_block',
    })
  })

  it('should log analytics when pressing venue map block content type and user location is not everywhere', async () => {
    renderTrendsModule()

    await user.press(screen.getByText('Accès carte des lieux'))

    expect(analytics.logConsultVenueMap).toHaveBeenNthCalledWith(1, { from: 'trend_block' })
  })

  it('should not log analytics when pressing venue map block content type and user location is everywhere', async () => {
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
    renderTrendsModule()

    await user.press(screen.getByText('Accès carte des lieux'))

    expect(analytics.logConsultVenueMap).not.toHaveBeenCalled()
  })

  it('should log trends block clicked when pressing a trend', async () => {
    renderTrendsModule()

    await user.press(screen.getByText('Tendance 1'))

    expect(analytics.logTrendsBlockClicked).toHaveBeenCalledWith({
      moduleListID: 'g6VpeYbOosfALeqR55Ah6',
      entryId: '4Fs4egA8G2z3fHgU2XQj3h',
      moduleId: '16ZgVwnOXvVc0N8ko9Kius',
      toEntryId: '7qcfqY5zFesLVO5fMb4cqm',
    })
  })

  it('should log trends block clicked when pressing venue map block content type', async () => {
    renderTrendsModule()

    await user.press(screen.getByText('Accès carte des lieux'))

    expect(analytics.logTrendsBlockClicked).toHaveBeenCalledWith({
      moduleListID: 'g6VpeYbOosfALeqR55Ah6',
      entryId: '4Fs4egA8G2z3fHgU2XQj3h',
      moduleId: '6dn0unOv4tRBNfOebVHOOy',
      toEntryId: '7qcfqY5zFesLVO5fMb4cqm',
    })
  })
})

function renderTrendsModule() {
  render(reactQueryProviderHOC(<TrendsModule {...formattedTrendsModule} {...trackingProps} />))
}
