import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { LocationType } from 'features/search/enums'
import { LocationModal, RadioButtonLocation } from 'features/search/pages/LocationModal'
import { initialSearchState } from 'features/search/pages/reducer'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { LocationFilter, SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { ChangeSearchLocationParam } from 'libs/firebase/analytics/analytics'
import {
  GeolocPermissionState,
  GeolocationError,
  GeoCoordinates,
  GeolocPositionError,
  GEOLOCATION_USER_ERROR_MESSAGE,
} from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
import { act, fireEvent, render, superFlushWithAct } from 'tests/utils'

let mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

const DEFAULT_POSITION = { latitude: 2, longitude: 40 } as GeoCoordinates
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
let mockPermissionState = GeolocPermissionState.GRANTED
let mockPositionError: GeolocationError | null = null
const mockTriggerPositionUpdate = jest.fn()
const mockShowGeolocPermissionModal = jest.fn()

jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    permissionState: mockPermissionState,
    position: mockPosition,
    positionError: mockPositionError,
    triggerPositionUpdate: mockTriggerPositionUpdate,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
  }),
}))

const hideLocationModal = jest.fn()

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

describe('LocationFilter component', () => {
  afterEach(() => {
    mockPermissionState = GeolocPermissionState.GRANTED
    mockPosition = DEFAULT_POSITION
    mockPositionError = null
  })

  it('should render modal correctly after animation and with enabled submit', async () => {
    jest.useFakeTimers()
    const renderAPI = renderLocationModal({ hideLocationModal })
    await superFlushWithAct()
    jest.advanceTimersByTime(2000)
    expect(renderAPI).toMatchSnapshot()
    jest.useRealTimers()
  })

  it('should navigate on search results with actual state with no change when pressing search button', async () => {
    const { getByText } = renderLocationModal({ hideLocationModal })

    await superFlushWithAct()

    const searchButton = getByText('Rechercher')
    await act(async () => {
      fireEvent.press(searchButton)
    })

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: {
        ...mockSearchState,
        view: SearchView.Results,
      },
      screen: 'Search',
    })
  })

  it.each`
    locationFilter                                                           | label                                        | locationType
    ${{ locationType: LocationType.EVERYWHERE }}                             | ${RadioButtonLocation.EVERYWHERE}            | ${LocationType.EVERYWHERE}
    ${{ locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS }}    | ${RadioButtonLocation.AROUND_ME}             | ${LocationType.AROUND_ME}
    ${{ locationType: LocationType.PLACE, place: Kourou, aroundRadius: 10 }} | ${RadioButtonLocation.CHOOSE_PLACE_OR_VENUE} | ${LocationType.PLACE}
    ${{ locationType: LocationType.VENUE, venue: Kourou }}                   | ${RadioButtonLocation.CHOOSE_PLACE_OR_VENUE} | ${LocationType.VENUE}
  `(
    'should select $label radio button by default when location type search state is $locationType',
    async ({
      locationFilter,
      label,
    }: {
      locationFilter: LocationFilter
      label: RadioButtonLocation
    }) => {
      mockSearchState = { ...mockSearchState, locationFilter }
      const { getByTestId } = renderLocationModal({ hideLocationModal })

      await superFlushWithAct()

      const radioButton = getByTestId(label)

      expect(radioButton.props.accessibilityState).toEqual({ checked: true })
    }
  )

  it.each`
    locationFilter                                                        | label                             | locationType
    ${{ locationType: LocationType.EVERYWHERE }}                          | ${RadioButtonLocation.EVERYWHERE} | ${LocationType.EVERYWHERE}
    ${{ locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS }} | ${RadioButtonLocation.AROUND_ME}  | ${LocationType.AROUND_ME}
  `(
    'should navigate on search results with $locationType location type when selecting $label radio button and pressing search button',
    async ({
      locationFilter,
      label,
    }: {
      locationFilter: LocationFilter
      label: RadioButtonLocation
    }) => {
      mockSearchState = { ...mockSearchState, locationFilter }
      const { getByTestId, getByText } = renderLocationModal({ hideLocationModal })

      const radioButton = getByTestId(label)
      await act(async () => {
        fireEvent.press(radioButton)
      })

      const searchButton = getByText('Rechercher')
      await act(async () => {
        fireEvent.press(searchButton)
      })

      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        params: {
          ...mockSearchState,
          locationFilter,
          view: SearchView.Results,
        },
        screen: 'Search',
      })
    }
  )

  it.each`
    locationFilter                                                        | label                             | locationType               | eventType
    ${{ locationType: LocationType.EVERYWHERE }}                          | ${RadioButtonLocation.EVERYWHERE} | ${LocationType.EVERYWHERE} | ${{ type: 'everywhere' }}
    ${{ locationType: LocationType.AROUND_ME, aroundRadius: MAX_RADIUS }} | ${RadioButtonLocation.AROUND_ME}  | ${LocationType.AROUND_ME}  | ${{ type: 'aroundMe' }}
  `(
    'should log ChangeSearchLocation event with $locationType location type when selecting $label radio button and pressing search button',
    async ({
      locationFilter,
      label,
      eventType,
    }: {
      locationFilter: LocationFilter
      label: RadioButtonLocation
      eventType: ChangeSearchLocationParam
    }) => {
      mockSearchState = { ...mockSearchState, locationFilter }
      const { getByTestId, getByText } = renderLocationModal({ hideLocationModal })

      const radioButton = getByTestId(label)
      await act(async () => {
        fireEvent.press(radioButton)
      })

      const searchButton = getByText('Rechercher')
      await act(async () => {
        fireEvent.press(searchButton)
      })

      expect(analytics.logChangeSearchLocation).toHaveBeenCalledWith(eventType)
    }
  )

  it('should display error message when select Autour de moi radio button when position is null', async () => {
    mockPosition = null
    mockPositionError = {
      type: GeolocPositionError.SETTINGS_NOT_SATISFIED,
      message: GEOLOCATION_USER_ERROR_MESSAGE[GeolocPositionError.SETTINGS_NOT_SATISFIED],
    }
    const { getByTestId, queryByText } = renderLocationModal({ hideLocationModal })

    const radioButton = getByTestId(RadioButtonLocation.AROUND_ME)
    await act(async () => {
      fireEvent.press(radioButton)
    })

    queryByText(mockPositionError.message)
  })

  it('should not change location filter on Autour de moi radio button press when position is null', async () => {
    mockSearchState = initialSearchState
    mockPosition = null
    const { getByTestId } = renderLocationModal({ hideLocationModal })

    const radioButton = getByTestId(RadioButtonLocation.AROUND_ME)
    await act(async () => {
      fireEvent.press(radioButton)
    })

    expect(radioButton.props.accessibilityState).toEqual({ checked: false })
  })

  it.each([
    [RadioButtonLocation.EVERYWHERE],
    [RadioButtonLocation.AROUND_ME],
    [RadioButtonLocation.CHOOSE_PLACE_OR_VENUE],
  ])(
    'should select %s radio button when pressing it and position is not null',
    async (locationRadioButton) => {
      const { getByTestId } = renderLocationModal({ hideLocationModal })

      const radioButton = getByTestId(locationRadioButton)
      await act(async () => {
        fireEvent.press(radioButton)
      })

      expect(radioButton.props.accessibilityState).toEqual({ checked: true })
    }
  )

  it('should reset the form when pressing reset button', async () => {
    mockSearchState = initialSearchState
    const { getByTestId, getByText } = renderLocationModal({ hideLocationModal })

    const defaultRadioButton = getByTestId(RadioButtonLocation.EVERYWHERE)
    const radioButton = getByTestId(RadioButtonLocation.AROUND_ME)
    expect(defaultRadioButton.props.accessibilityState).toEqual({ checked: true })
    expect(radioButton.props.accessibilityState).toEqual({ checked: false })

    await act(async () => {
      fireEvent.press(radioButton)
    })
    expect(defaultRadioButton.props.accessibilityState).toEqual({ checked: false })
    expect(radioButton.props.accessibilityState).toEqual({ checked: true })

    const resetButton = getByText('Réinitialiser')
    await act(async () => {
      fireEvent.press(resetButton)
    })
    expect(defaultRadioButton.props.accessibilityState).toEqual({ checked: true })
    expect(radioButton.props.accessibilityState).toEqual({ checked: false })
  })

  describe('should close the modal', () => {
    it('when pressing search button', async () => {
      const { getByTestId } = renderLocationModal({ hideLocationModal })

      await superFlushWithAct()

      const searchButton = getByTestId('Rechercher')

      await act(async () => {
        fireEvent.press(searchButton)
      })

      expect(hideLocationModal).toHaveBeenCalled()
    })

    it('when pressing previous button', async () => {
      const { getByTestId } = renderLocationModal({ hideLocationModal })

      await superFlushWithAct()

      const previousButton = getByTestId('backButton')
      fireEvent.press(previousButton)

      expect(hideLocationModal).toHaveBeenCalled()
    })
  })
})

type Props = {
  hideLocationModal: () => void
}

function renderLocationModal({ hideLocationModal }: Props) {
  return render(
    <LocationModal
      title="Localisation"
      accessibilityLabel="Ne pas filtrer sur la localisation et retourner aux résultats"
      isVisible={true}
      hideModal={hideLocationModal}
    />
  )
}
