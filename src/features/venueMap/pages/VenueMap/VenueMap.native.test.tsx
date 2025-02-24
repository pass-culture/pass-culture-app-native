import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import * as useGoBack from 'features/navigation/useGoBack'
import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import { VenueMap } from 'features/venueMap/pages/VenueMap/VenueMap'
import { useVenueTypeCode, venueTypeCodeActions } from 'features/venueMap/store/venueTypeCodeStore'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('features/venue/api/useVenueOffers')

const mockGoBack = jest.fn()
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: mockGoBack,
  canGoBack: jest.fn(() => true),
})

jest.mock('features/venueMap/store/venueTypeCodeStore')
const mockSetVenueTypeCode = jest.spyOn(venueTypeCodeActions, 'setVenueTypeCode')
const mockUseVenueTypeCode = useVenueTypeCode as jest.Mock

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

const VENUE_TYPE = VenueTypeCodeKey.MOVIE

const user = userEvent.setup()
jest.useFakeTimers()

describe('<VenueMap />', () => {
  beforeEach(() => {
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_OFFERS_IN_BOTTOM_SHEET,
      RemoteStoreFeatureFlags.WIP_VENUE_MAP_TYPE_FILTER_V2,
    ]) // TODO(PC-34435): add tests for WIP_VENUE_MAP_HIDDEN_POI and when the wipOffersInBottomSheet and wipVenueMapTypeFilterV2 are off
    mockUseVenueTypeCode.mockReturnValue(VENUE_TYPE)
  })

  it('Should display venue map header', async () => {
    render(reactQueryProviderHOC(<VenueMap />))

    await screen.findAllByTestId(/[A-Z]+Label/)

    Object.keys(FILTERS_VENUE_TYPE_MAPPING).forEach((id) => {
      expect(screen.getByTestId(`${id}Label`)).toBeOnTheScreen()
    })

    expect(screen.getByText('Carte des lieux')).toBeOnTheScreen()
  })

  it('Should handle go back action when pressing go back button', async () => {
    render(reactQueryProviderHOC(<VenueMap />))

    const goBackButton = screen.getByTestId('Revenir en arrière')
    await user.press(goBackButton)

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('Should reset venue type code in store when pressing go back button', async () => {
    render(reactQueryProviderHOC(<VenueMap />))

    const goBackButton = screen.getByTestId('Revenir en arrière')
    await user.press(goBackButton)

    expect(mockSetVenueTypeCode).toHaveBeenNthCalledWith(1, null)
  })
})
