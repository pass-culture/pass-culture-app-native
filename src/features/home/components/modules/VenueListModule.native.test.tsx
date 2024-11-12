import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { VenueListModule } from 'features/home/components/modules/VenueListModule'
import { venuesSearchFixture } from 'libs/algolia/fixtures/venuesSearchFixture'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

const mockShowModal = jest.fn()
const useModalAPISpy = jest.spyOn(useModalAPI, 'useModal')

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

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('<VenueListModule />', () => {
  it('should display venue list', () => {
    render(
      <VenueListModule
        venues={venuesSearchFixture.hits}
        moduleId="toto"
        homeVenuesListEntryId="tata"
      />
    )

    expect(screen.getByText('LES LIEUX CULTURELS À PROXIMITÉ')).toBeOnTheScreen()
  })

  it('should redirect to venue map when pressing on venue list title', async () => {
    render(
      <VenueListModule
        venues={venuesSearchFixture.hits}
        moduleId="toto"
        homeVenuesListEntryId="tata"
      />
    )

    fireEvent.press(screen.getByText('LES LIEUX CULTURELS À PROXIMITÉ'))

    await waitFor(() => {
      expect(navigate).toHaveBeenNthCalledWith(1, 'VenueMap', undefined)
    })
  })

  it('should reset selected venue in store when pressing on venue list title', async () => {
    render(
      <VenueListModule
        venues={venuesSearchFixture.hits}
        moduleId="toto"
        homeVenuesListEntryId="tata"
      />
    )

    fireEvent.press(screen.getByText('LES LIEUX CULTURELS À PROXIMITÉ'))

    await waitFor(() => {
      expect(mockRemoveSelectedVenue).toHaveBeenCalledTimes(1)
    })
  })

  it('should open venue map location modal when pressing on venue list module when user is not located', () => {
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

    render(
      <VenueListModule
        venues={venuesSearchFixture.hits}
        moduleId="toto"
        homeVenuesListEntryId="tata"
      />
    )

    fireEvent.press(screen.getByText('LES LIEUX CULTURELS À PROXIMITÉ'))

    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it('should trigger log ConsultVenueMap when pressing on venue list title', async () => {
    render(
      <VenueListModule
        venues={venuesSearchFixture.hits}
        moduleId="toto"
        homeVenuesListEntryId="tata"
      />
    )

    fireEvent.press(screen.getByText('LES LIEUX CULTURELS À PROXIMITÉ'))

    await waitFor(() => {
      expect(analytics.logConsultVenueMap).toHaveBeenNthCalledWith(1, { from: 'venueList' })
    })
  })
})
