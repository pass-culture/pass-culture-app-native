import React, { useState } from 'react'
import { Button } from 'react-native'
import { ReactTestInstance } from 'react-test-renderer'

import { SearchLocationModal } from 'features/location/components/SearchLocationModal'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { initialSearchState } from 'features/search/context/reducer'
import * as useSearch from 'features/search/context/SearchWrapper'
import { SearchState } from 'features/search/types'
import { analytics } from 'libs/analytics/provider'
import { checkGeolocPermission, GeolocPermissionState, LocationWrapper } from 'libs/location'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { requestGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { MODAL_TO_HIDE_TIME, MODAL_TO_SHOW_TIME } from 'tests/constants'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

jest.useFakeTimers()
jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

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

jest.mock('libs/place/usePlaces', () => ({
  usePlaces: () => ({ data: mockPlaces, isLoading: false }),
}))

const mockDispatch = jest.fn()
const mockSearchState: SearchState = {
  ...initialSearchState,
  locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: DEFAULT_RADIUS },
}

jest.spyOn(useSearch, 'useSearch').mockReturnValue({
  searchState: mockSearchState,
  dispatch: mockDispatch,
  resetSearch: jest.fn(),
  isFocusOnSuggestions: false,
  showSuggestions: jest.fn(),
  hideSuggestions: jest.fn(),
})

describe('SearchLocationModal', () => {
  it('should render correctly if modal visible', async () => {
    renderSearchLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen).toMatchSnapshot()
  })

  it('should trigger logEvent "logUserSetLocation" on onSubmit', async () => {
    renderSearchLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })
    const openLocationModalButton = screen.getByText('Choisir une localisation')
    fireEvent.press(openLocationModalButton)

    const searchInput = screen.getByTestId('styled-input-container')
    fireEvent.changeText(searchInput, mockPlaces[0].label)

    const suggestedPlace = await screen.findByText(mockPlaces[0].label)
    fireEvent.press(suggestedPlace)

    const validateButon = screen.getByText('Valider la localisation')
    fireEvent.press(validateButon)

    expect(analytics.logUserSetLocation).toHaveBeenCalledWith('search')
  })

  it('should hide modal on close modal button press', async () => {
    renderSearchLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    fireEvent.press(screen.getByLabelText('Fermer la modale'))

    await waitFor(() => {
      expect(screen.queryByText('Localisation')).not.toBeOnTheScreen()
    })
  })

  it('should highlight geolocation button if geolocation is enabled', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })
    mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

    renderSearchLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    const geolocPositionButton = screen.getByText('Utiliser ma position actuelle')
    await act(() => {
      fireEvent.press(geolocPositionButton)
    })

    expect(screen.getByText('Utiliser ma position actuelle')).toHaveStyle({ color: '#eb0055' })
  })

  it('should hide Géolocalisation désactivée if geolocation is enabled', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    renderSearchLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.queryByText('Géolocalisation désactivée')).toBeNull()
  })

  it('should request geolocation if geolocation is denied and the geolocation button pressed', async () => {
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.DENIED)

    renderSearchLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    await act(async () => {
      fireEvent.press(screen.getByText('Utiliser ma position actuelle'))
    })

    expect(mockRequestGeolocPermission).toHaveBeenCalledTimes(1)
  })

  it('should show geolocation modal if geolocation is never_ask_again on closing the modal after a geolocation button press', async () => {
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.NEVER_ASK_AGAIN)

    const Container = () => {
      const [visible, setVisible] = React.useState(true)
      return (
        <LocationWrapper>
          <React.Fragment>
            <SearchLocationModal
              visible={visible}
              dismissModal={() => fireEvent.press(screen.getByText('Close'))}
            />
            <Button title="Close" onPress={() => setVisible(false)} />
          </React.Fragment>
        </LocationWrapper>
      )
    }
    render(<Container />)
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })
    fireEvent.press(screen.getByText('Utiliser ma position actuelle'))

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_HIDE_TIME)
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.getByText('Paramètres de localisation')).toBeOnTheScreen()
  })

  describe('PlaceRadius', () => {
    it("should display default radius if it wasn't set previously", async () => {
      renderSearchLocationModal()
      await act(async () => {
        jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
      })
      await act(async () => {
        const openLocationModalButton = screen.getByText('Choisir une localisation')
        fireEvent.press(openLocationModalButton)
      })
      await act(async () => {
        const searchInput = screen.getByTestId('styled-input-container')
        fireEvent.changeText(searchInput, mockPlaces[0].label)
      })
      await act(async () => {
        const suggestedPlace = await screen.findByText(mockPlaces[0].label)
        fireEvent.press(suggestedPlace)
      })

      expect(screen.getByText(radiusWithKm(DEFAULT_RADIUS))).toBeOnTheScreen()
    })

    it('should call searchContext dispatch with mockRadiusPlace when pressing "Valider la localisation"', async () => {
      renderSearchLocationModal()
      await act(async () => {
        jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
      })
      const openLocationModalButton = screen.getByText('Choisir une localisation')
      fireEvent.press(openLocationModalButton)

      const searchInput = screen.getByTestId('styled-input-container')
      await act(async () => {
        fireEvent.changeText(searchInput, mockPlaces[0].label)
      })

      const suggestedPlace = await screen.findByText(mockPlaces[0].label)
      fireEvent.press(suggestedPlace)

      await act(async () => {
        const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChange([mockRadiusPlace])
      })

      fireEvent.press(screen.getByText('Valider la localisation'))

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          aroundRadius: mockRadiusPlace,
          place: mockPlaces[0],
        },
        type: 'SET_LOCATION_PLACE',
      })
    })

    it('should display default radius even if an AroundMeRadius was set previously', async () => {
      mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
      renderSearchLocationModal()
      await act(async () => {
        jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
      })
      await act(async () => {
        fireEvent.press(screen.getByText('Utiliser ma position actuelle'))
      })

      await act(async () => {
        const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChange([mockAroundMeRadius])
      })

      const openLocationModalButton = screen.getByText('Choisir une localisation')
      fireEvent.press(openLocationModalButton)

      const searchInput = screen.getByTestId('styled-input-container')
      fireEvent.changeText(searchInput, mockPlaces[0].label)

      const suggestedPlace = await screen.findByText(mockPlaces[0].label)
      fireEvent.press(suggestedPlace)

      expect(screen.getByText(radiusWithKm(DEFAULT_RADIUS))).toBeOnTheScreen()
    })
  })

  describe('AroundMeRadius', () => {
    it("should display default radius if it wasn't set previously", async () => {
      mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
      renderSearchLocationModal()
      await act(async () => {
        jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
      })
      const geolocPositionButton = screen.getByText('Utiliser ma position actuelle')
      await act(() => {
        fireEvent.press(geolocPositionButton)
      })

      expect(screen.getByText('Utiliser ma position actuelle')).toHaveStyle({ color: '#eb0055' })

      expect(screen.getByText(radiusWithKm(DEFAULT_RADIUS))).toBeOnTheScreen()
    })

    it('should call searchContext dispatch with mockAroundMeRadius when pressing "Valider la localisation"', async () => {
      getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })
      mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

      renderSearchLocationModal()
      await act(async () => {
        jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
      })
      const geolocPositionButton = screen.getByText('Utiliser ma position actuelle')
      await act(() => {
        fireEvent.press(geolocPositionButton)
      })

      await act(async () => {
        const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChange([mockAroundMeRadius])
      })

      fireEvent.press(screen.getByText('Valider la localisation'))

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: mockAroundMeRadius,
        type: 'SET_LOCATION_AROUND_ME',
      })
    })

    it('should display default radius even if a PlaceRadius was set previously', async () => {
      getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })
      mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
      mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

      renderSearchLocationModal()
      await act(async () => {
        jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
      })
      const openLocationModalButton = screen.getByText('Choisir une localisation')
      fireEvent.press(openLocationModalButton)

      const searchInput = screen.getByTestId('styled-input-container')
      await act(async () => {
        fireEvent.changeText(searchInput, mockPlaces[0].label)
      })

      const suggestedPlace = await screen.findByText(mockPlaces[0].label)
      fireEvent.press(suggestedPlace)

      await act(async () => {
        const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChange([mockRadiusPlace])
      })

      const validateButon = screen.getByText('Valider la localisation')
      fireEvent.press(validateButon)

      const mockOpenModalButton = screen.getByText('Open modal')
      fireEvent.press(mockOpenModalButton)

      await act(async () => {
        const openGeolocationModalButton = screen.getByText('Utiliser ma position actuelle')
        fireEvent.press(openGeolocationModalButton)
      })

      expect(screen.getByText(radiusWithKm(DEFAULT_RADIUS))).toBeOnTheScreen()
    })
  })
})

function renderSearchLocationModal() {
  render(
    <LocationWrapper>
      <SearchLocationModalWithMockButton />
    </LocationWrapper>
  )
}

const SearchLocationModalWithMockButton = () => {
  const [visible, setVisible] = useState<boolean>(true)

  return (
    <React.Fragment>
      <Button title="Open modal" onPress={() => setVisible(true)} />
      <SearchLocationModal visible={visible} dismissModal={() => setVisible(false)} />
    </React.Fragment>
  )
}
