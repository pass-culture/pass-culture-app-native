import { useRoute } from '@react-navigation/native'
import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import * as useGoBack from 'features/navigation/useGoBack'
import * as useVenueSearchParameters from 'features/venue/helpers/useVenueSearchParameters'
import { VenueOffers } from 'features/venue/types'
import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import { VenueMap } from 'features/venueMap/pages/VenueMap/VenueMap'
import * as venueMapStore from 'features/venueMap/store/venueMapStore'
import { venuesFilterActions } from 'features/venueMap/store/venuesFilterStore'
import mockVenueSearchParams from 'fixtures/venueSearchParams'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import * as useVenueOffersQueryAPI from 'queries/venue/useVenueOffersQuery'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

jest.mock('@react-navigation/native')
jest.mock('react-native-map-clustering')
jest.mock('features/venueMap/helpers/zoomOutIfMapEmpty')
jest.mock('react-native-gesture-handler/lib/commonjs/handlers/gestures/GestureDetector')

const mockUseRoute = useRoute as jest.Mock
mockUseRoute.mockReturnValue({ name: 'venueMap' })

jest.spyOn(useVenueOffersQueryAPI, 'useVenueOffersQuery').mockReturnValue({
  isLoading: false,
  data: { hits: [], nbHits: 0 },
} as unknown as UseQueryResult<VenueOffers, unknown>)

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('@gorhom/bottom-sheet', () => {
  const ActualBottomSheet = jest.requireActual('@gorhom/bottom-sheet/mock').default

  class MockBottomSheet extends ActualBottomSheet {
    close() {
      this.props.onAnimate(0, -1)
    }
    expand() {
      this.props.onAnimate(0, 2)
    }
    collapse() {
      this.props.onAnimate(-1, 0)
    }
  }
  return {
    __esModule: true,
    ...require('@gorhom/bottom-sheet/mock'),
    default: MockBottomSheet,
  }
})

jest
  .spyOn(useVenueSearchParameters, 'useVenueSearchParameters')
  .mockReturnValue(mockVenueSearchParams)

jest.mock('features/search/context/SearchWrapper')

const VENUE_TYPE = VenueTypeCodeKey.MOVIE

describe('<VenueMap />', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.useFakeTimers()
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_OFFERS_IN_BOTTOM_SHEET,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
    ])
    venuesFilterActions.setVenuesFilters([VENUE_TYPE])
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render without FF', async () => {
    setFeatureFlags()

    render(reactQueryProviderHOC(<VenueMap />))

    expect(await screen.findByTestId('venue-map-view')).toBeOnTheScreen()
  })

  it('Should display venue map header', async () => {
    render(reactQueryProviderHOC(<VenueMap />))

    await screen.findAllByTestId(/[A-Z]+Label/)

    Object.keys(FILTERS_VENUE_TYPE_MAPPING).forEach((id) => {
      expect(screen.getByTestId(`${id}Label`)).toBeOnTheScreen()
    })

    expect(screen.getByText('Carte des lieux')).toBeOnTheScreen()
  })

  it('should hide POI', async () => {
    render(reactQueryProviderHOC(<VenueMap />))

    expect(await screen.findByTestId('venue-map-view')).toHaveProp('showsPointsOfInterest', false)
  })

  it('Should handle go back action when pressing go back button', async () => {
    render(reactQueryProviderHOC(<VenueMap />))

    const goBackButton = screen.getByTestId('Revenir en arrière')
    await user.press(goBackButton)

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('Should reset venue type code in store when pressing go back button', async () => {
    const spy = jest.spyOn(venuesFilterActions, 'setVenuesFilters')
    render(reactQueryProviderHOC(<VenueMap />))

    const goBackButton = screen.getByTestId('Revenir en arrière')
    await user.press(goBackButton)

    await waitFor(() => expect(spy).toHaveBeenNthCalledWith(1, []))
  })

  it('Should reset store + filters when unmounting', async () => {
    const spyClearStore = jest.spyOn(venueMapStore, 'clearVenueMapStore')
    const spyResetFilters = jest.spyOn(venuesFilterActions, 'reset')

    const { unmount } = render(reactQueryProviderHOC(<VenueMap />))

    unmount()

    await waitFor(() => expect(spyClearStore).toHaveBeenCalledWith())

    expect(spyResetFilters).toHaveBeenCalledWith()
  })
})
