import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import { goBack, replace, useRoute } from '__mocks__/@react-navigation/native'
import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { DEFAULT_RADIUS } from 'features/search/constants'
import * as useVenueMapStore from 'features/venueMap/store/venueMapStore'
import { analytics } from 'libs/analytics/provider'
import { GeolocationActivationModal } from 'libs/location/components/GeolocationActivationModal'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { requestGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import { checkGeolocPermission, GeolocPermissionState } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import { initLocation } from 'libs/locationV2/initLocation'
import { locationActions } from 'libs/locationV2/location.store'
import { SuggestedPlace } from 'libs/place/types'
import { MODAL_TO_SHOW_TIME } from 'tests/constants'
import { act, fireEvent, render, screen, userEvent } from 'tests/utils'

jest.useFakeTimers()

const mockRadiusPlace = 37
const mockAroundMeRadius = 73

const radiusWithKm = (radius: number): string => {
  return `${radius.toString()} km`
}
const mockPlaces = [
  {
    label: 'Kourou',
    info: 'Guyane',
    type: 'street',
    geolocation: { longitude: -52.669736, latitude: 5.16186 },
  },
] as const satisfies readonly SuggestedPlace[]

jest.mock('libs/location/geolocation/getGeolocPosition/getGeolocPosition')
const getGeolocPositionMock = getGeolocPosition as jest.MockedFunction<typeof getGeolocPosition>

jest.mock('libs/location/geolocation/requestGeolocPermission/requestGeolocPermission')
const mockRequestGeolocPermission = requestGeolocPermission as jest.MockedFunction<
  typeof requestGeolocPermission
>

jest.mock('libs/location/geolocation/checkGeolocPermission/checkGeolocPermission')
const mockCheckGeolocPermission = checkGeolocPermission as jest.MockedFunction<
  typeof checkGeolocPermission
>
mockCheckGeolocPermission.mockResolvedValue(GeolocPermissionState.GRANTED)

jest.mock('libs/place/queries/usePlacesQuery', () => ({
  usePlacesQuery: () => ({ data: mockPlaces, isLoading: false }),
}))

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    dispatch: jest.fn(),
  }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const removeSelectedVenueSpy = jest.spyOn(useVenueMapStore, 'removeSelectedVenue')

const user = userEvent.setup()

describe('VenueMapLocationModal', () => {
  beforeEach(() => {
    initLocation()
    useRoute.mockReturnValue({ params: { openedFrom: 'searchPlaylist' } })
  })

  it('should render correctly if modal visible', async () => {
    renderVenueMapLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen).toMatchSnapshot()
  })

  it('should trigger logEvent "logUserSetLocation" on onSubmit', async () => {
    renderVenueMapLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })
    const openLocationModalButton = screen.getByText('Choisir une zone géographique')
    await user.press(openLocationModalButton)

    const searchInput = screen.getByTestId('styled-input-container')
    fireEvent.changeText(searchInput, mockPlaces[0].label)

    const suggestedPlace = await screen.findByText(mockPlaces[0].label)
    // userEvent.press not working correctly here
    // eslint-disable-next-line local-rules/no-fireEvent
    fireEvent.press(suggestedPlace)

    const validateButon = screen.getByText('Valider et voir sur la carte')
    await user.press(validateButon)

    expect(analytics.logUserSetLocation).toHaveBeenCalledWith('venueMap')
  })

  it('should go back on close modal button press', async () => {
    renderVenueMapLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    await user.press(screen.getByLabelText('Fermer la modale'))

    expect(goBack).toHaveBeenCalledTimes(1)
  })

  it('should highlight geolocation button if geolocation is enabled', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })
    mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

    renderVenueMapLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    const geolocPositionButton = screen.getByText('Utiliser ma position actuelle')

    await user.press(geolocPositionButton)

    expect(screen.getByLabelText(/Utiliser ma position actuelle/)).toHaveAccessibilityState({
      checked: true,
    })
  })

  it('should hide "Géolocalisation désactivée" if geolocation is enabled', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    renderVenueMapLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.queryByText('Géolocalisation désactivée')).toBeNull()
  })

  it('should navigate to venue map on submit when we choose a location and shouldOpenMapInTab is not true', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })
    mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

    renderVenueMapLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })
    const openLocationModalButton = screen.getByText('Choisir une zone géographique')
    await user.press(openLocationModalButton)

    const searchInput = screen.getByTestId('styled-input-container')
    await act(async () => {
      fireEvent.changeText(searchInput, mockPlaces[0].label)
    })

    const suggestedPlace = await screen.findByText(mockPlaces[0].label)
    // userEvent.press not working correctly here
    // eslint-disable-next-line local-rules/no-fireEvent
    fireEvent.press(suggestedPlace)

    await act(async () => {
      const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
      slider.props.onValuesChange([mockRadiusPlace])
    })

    const validateButon = screen.getByText('Valider et voir sur la carte')
    await user.press(validateButon)

    expect(replace).toHaveBeenCalledWith('VenueMap')
  })

  it('should trigger ConsultVenueMap log on submit when we choose a location, shouldOpenMapInTab is not true and openedFrom defined', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })
    mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

    renderVenueMapLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })
    const openLocationModalButton = screen.getByText('Choisir une zone géographique')
    await user.press(openLocationModalButton)

    const searchInput = screen.getByTestId('styled-input-container')
    await act(async () => {
      fireEvent.changeText(searchInput, mockPlaces[0].label)
    })

    const suggestedPlace = await screen.findByText(mockPlaces[0].label)
    // userEvent.press not working correctly here
    // eslint-disable-next-line local-rules/no-fireEvent
    fireEvent.press(suggestedPlace)

    await act(async () => {
      const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
      slider.props.onValuesChange([mockRadiusPlace])
    })

    const validateButon = screen.getByText('Valider et voir sur la carte')
    await user.press(validateButon)

    expect(analytics.logConsultVenueMap).toHaveBeenCalledWith({ from: 'searchPlaylist' })
  })

  it('should reset selected venue in store on submit when we choose a location', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })
    mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

    renderVenueMapLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })
    const openLocationModalButton = screen.getByText('Choisir une zone géographique')
    await user.press(openLocationModalButton)

    const searchInput = screen.getByTestId('styled-input-container')
    await act(async () => {
      fireEvent.changeText(searchInput, mockPlaces[0].label)
    })

    const suggestedPlace = await screen.findByText(mockPlaces[0].label)
    // userEvent.press not working correctly here
    // eslint-disable-next-line local-rules/no-fireEvent
    fireEvent.press(suggestedPlace)

    await act(async () => {
      const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
      slider.props.onValuesChange([mockRadiusPlace])
    })

    const validateButon = screen.getByText('Valider et voir sur la carte')
    await user.press(validateButon)

    expect(removeSelectedVenueSpy).toHaveBeenCalledTimes(1)
  })

  it('should not navigate to venue map on submit when we choose a location and shouldOpenMapInTab is true', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })
    mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

    renderVenueMapLocationModal({ shouldOpenMapInTab: true })
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })
    const openLocationModalButton = screen.getByText('Choisir une zone géographique')
    await user.press(openLocationModalButton)

    const searchInput = screen.getByTestId('styled-input-container')
    await act(async () => {
      fireEvent.changeText(searchInput, mockPlaces[0].label)
    })

    const suggestedPlace = await screen.findByText(mockPlaces[0].label)
    // userEvent.press not working correctly here
    // eslint-disable-next-line local-rules/no-fireEvent
    fireEvent.press(suggestedPlace)

    await act(async () => {
      const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
      slider.props.onValuesChange([mockRadiusPlace])
    })

    const validateButon = screen.getByText('Valider et voir sur la carte')
    await user.press(validateButon)

    expect(replace).not.toHaveBeenCalled()
  })

  it('should set location mode when submit', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })
    mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

    const setLocationModeSpy = jest.spyOn(locationActions, 'setLocationMode')

    renderVenueMapLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })
    const openLocationModalButton = screen.getByText('Choisir une zone géographique')
    await user.press(openLocationModalButton)

    const searchInput = screen.getByTestId('styled-input-container')
    await act(async () => {
      fireEvent.changeText(searchInput, mockPlaces[0].label)
    })

    const suggestedPlace = await screen.findByText(mockPlaces[0].label)
    // userEvent.press not working correctly here
    // eslint-disable-next-line local-rules/no-fireEvent
    fireEvent.press(suggestedPlace)

    await act(async () => {
      const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
      slider.props.onValuesChange([mockRadiusPlace])
    })

    const validateButon = screen.getByText('Valider et voir sur la carte')
    await user.press(validateButon)

    expect(setLocationModeSpy).toHaveBeenCalledWith(LocationMode.AROUND_PLACE)
  })

  it('should request geolocation if geolocation is denied and the geolocation button pressed', async () => {
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.DENIED)

    renderVenueMapLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    await user.press(screen.getByText('Utiliser ma position actuelle'))

    expect(mockRequestGeolocPermission).toHaveBeenCalledTimes(1)
  })

  describe('PlaceRadius', () => {
    it("should display default radius if it wasn't set previously", async () => {
      renderVenueMapLocationModal()

      const openLocationModalButton = screen.getByText('Choisir une zone géographique')
      await user.press(openLocationModalButton)

      const searchInput = screen.getByTestId('styled-input-container')
      fireEvent.changeText(searchInput, mockPlaces[0].label)
      const suggestedPlace = await screen.findByText(mockPlaces[0].label)
      // userEvent.press not working correctly here
      // eslint-disable-next-line local-rules/no-fireEvent
      fireEvent.press(suggestedPlace)

      expect(screen.getByText(radiusWithKm(DEFAULT_RADIUS))).toBeOnTheScreen()
    })

    it('should display default radius even if an AroundMeRadius was set previously', async () => {
      mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
      renderVenueMapLocationModal()
      await act(async () => {
        jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
      })

      await user.press(screen.getByText('Utiliser ma position actuelle'))

      await act(async () => {
        const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChange([mockAroundMeRadius])
      })

      const openLocationModalButton = screen.getByText('Choisir une zone géographique')
      await user.press(openLocationModalButton)

      const searchInput = screen.getByTestId('styled-input-container')
      fireEvent.changeText(searchInput, mockPlaces[0].label)

      const suggestedPlace = await screen.findByText(mockPlaces[0].label)
      // userEvent.press not working correctly here
      // eslint-disable-next-line local-rules/no-fireEvent
      fireEvent.press(suggestedPlace)

      expect(screen.getByText(radiusWithKm(DEFAULT_RADIUS))).toBeOnTheScreen()
    })
  })

  describe('AroundMeRadius', () => {
    it("should display default radius if it wasn't set previously", async () => {
      mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
      renderVenueMapLocationModal()
      await act(async () => {
        jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
      })
      const geolocPositionButton = screen.getByText('Utiliser ma position actuelle')

      await user.press(geolocPositionButton)

      expect(screen.getByLabelText(/Utiliser ma position actuelle/)).toHaveAccessibilityState({
        checked: true,
      })

      expect(screen.getByText(radiusWithKm(DEFAULT_RADIUS))).toBeOnTheScreen()
    })

    it('should display default radius even if a PlaceRadius was set previously', async () => {
      getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })
      mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
      mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

      renderVenueMapLocationModal()
      await act(async () => {
        jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
      })
      const openLocationModalButton = screen.getByText('Choisir une zone géographique')
      await user.press(openLocationModalButton)

      const searchInput = screen.getByTestId('styled-input-container')
      await act(async () => {
        fireEvent.changeText(searchInput, mockPlaces[0].label)
      })

      const suggestedPlace = await screen.findByText(mockPlaces[0].label)
      // userEvent.press not working correctly here
      // eslint-disable-next-line local-rules/no-fireEvent
      fireEvent.press(suggestedPlace)

      await act(async () => {
        const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChange([mockRadiusPlace])
      })

      const validateButon = screen.getByText('Valider et voir sur la carte')
      await user.press(validateButon)

      const openGeolocationModalButton = screen.getByText('Utiliser ma position actuelle')
      await user.press(openGeolocationModalButton)

      expect(screen.getByText(radiusWithKm(DEFAULT_RADIUS))).toBeOnTheScreen()
    })
  })
})

function renderVenueMapLocationModal({
  shouldOpenMapInTab,
}: {
  shouldOpenMapInTab?: boolean
} = {}) {
  useRoute.mockReturnValue({
    params: { openedFrom: 'searchPlaylist', shouldOpenMapInTab },
  })

  render(
    <React.Fragment>
      <GeolocationActivationModal />
      <VenueMapLocationModal />
    </React.Fragment>
  )
}
