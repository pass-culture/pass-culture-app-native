import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/context/reducer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { fireEvent, render, screen, waitFor } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

import { CategoriesList } from './CategoriesList'

const mockShowModal = jest.fn()
const useModalAPISpy = jest.spyOn(useModalAPI, 'useModal')
useModalAPISpy.mockReturnValue({
  visible: false,
  showModal: mockShowModal,
  hideModal: jest.fn(),
  toggleModal: jest.fn(),
})
jest.mock('libs/subcategories/useSubcategories')

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

const mockedPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

const mockHasGeolocPosition = false
const mockSelectedLocationMode = LocationMode.EVERYWHERE

const mockUseLocation = jest.fn(() => ({
  hasGeolocPosition: mockHasGeolocPosition,
  selectedLocationMode: mockSelectedLocationMode,
  place: mockedPlace,
  onModalHideRef: jest.fn(),
}))
jest.mock('libs/location', () => ({
  useLocation: () => mockUseLocation(),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/TabBar/routes')

describe('CategoriesList', () => {
  beforeEach(() => {
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_VENUE_MAP,
      RemoteStoreFeatureFlags.WIP_APP_V2_VENUE_MAP_BLOCK,
    ])
  })

  it('should display categories', async () => {
    render(<CategoriesList />)

    await waitFor(async () => {
      expect(screen.getByText('Cinéma'.toUpperCase())).toBeOnTheScreen()
    })
  })

  it('should navigate to search results with search params on press', async () => {
    render(<CategoriesList />)

    const categoryButton = screen.getByText('Spectacles'.toUpperCase())
    fireEvent.press(categoryButton)
    await waitFor(async () => {
      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        params: {
          params: {
            ...mockSearchState,
            offerSubcategories: [],
            offerNativeCategories: undefined,
            offerGenreTypes: undefined,
            searchId: 'testUuidV4',
            isFullyDigitalOffersCategory: undefined,
            isFromHistory: undefined,
            offerCategories: ['SPECTACLES'],
            accessibilityFilter: {
              isAudioDisabilityCompliant: undefined,
              isMentalDisabilityCompliant: undefined,
              isMotorDisabilityCompliant: undefined,
              isVisualDisabilityCompliant: undefined,
            },
          },
          screen: 'SearchResults',
        },
        screen: 'SearchStackNavigator',
      })
    })
  })

  it.each`
    hasGeolocPosition | selectedLocationMode      | place          | FF
    ${true}           | ${LocationMode.AROUND_ME} | ${mockedPlace} | ${[]}
    ${false}          | ${LocationMode.AROUND_ME} | ${mockedPlace} | ${[RemoteStoreFeatureFlags.WIP_VENUE_MAP, RemoteStoreFeatureFlags.WIP_APP_V2_VENUE_MAP_BLOCK]}
  `(
    'should not display venue map block',
    async ({ hasGeolocPosition, selectedLocationMode, place, FF }) => {
      setFeatureFlags(FF)
      mockUseLocation.mockReturnValueOnce({
        hasGeolocPosition,
        selectedLocationMode,
        place,
        onModalHideRef: jest.fn(),
      })
      render(<CategoriesList />)

      expect(screen.queryByText('Explore la carte')).not.toBeOnTheScreen()
    }
  )

  it.each`
    hasGeolocPosition | selectedLocationMode         | place
    ${true}           | ${LocationMode.AROUND_ME}    | ${undefined}
    ${false}          | ${LocationMode.AROUND_PLACE} | ${mockedPlace}
    ${true}           | ${LocationMode.AROUND_PLACE} | ${mockedPlace}
    ${true}           | ${LocationMode.EVERYWHERE}   | ${undefined}
    ${false}          | ${LocationMode.EVERYWHERE}   | ${undefined}
  `(
    'should display venue map block',
    async ({ hasGeolocPosition, selectedLocationMode, place }) => {
      setFeatureFlags([
        RemoteStoreFeatureFlags.WIP_VENUE_MAP,
        RemoteStoreFeatureFlags.WIP_APP_V2_VENUE_MAP_BLOCK,
      ])
      mockUseLocation.mockReturnValueOnce({
        hasGeolocPosition,
        selectedLocationMode,
        place,
        onModalHideRef: jest.fn(),
      })

      render(<CategoriesList />)

      expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
    }
  )

  it('should open venue map location modal when pressing on venue map block', () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: false,
      selectedLocationMode: LocationMode.EVERYWHERE,
      place: mockedPlace,
      onModalHideRef: jest.fn(),
    })

    render(<CategoriesList />)

    fireEvent.press(screen.getByText('Explore la carte'))

    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })
})