import React, { useState } from 'react'
import { Button } from 'react-native'
import { ReactTestInstance } from 'react-test-renderer'

import {
  DEFAULT_RADIUS,
  SearchLocationModal,
} from 'features/location/components/SearchLocationModal'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { initialSearchState } from 'features/search/context/reducer'
import * as useSearch from 'features/search/context/SearchWrapper'
import { LocationType } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { analytics } from 'libs/analytics'
import { checkGeolocPermission, GeolocPermissionState, LocationWrapper } from 'libs/geolocation'
import { getPosition } from 'libs/geolocation/getPosition'
import { requestGeolocPermission } from 'libs/geolocation/requestGeolocPermission'
import { SuggestedPlace } from 'libs/place'
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForModalToHide,
  waitForModalToShow,
} from 'tests/utils'

const mockRadiusPlace = 37
const mockAroundMeRadius = 73

const radiusWithKm = (radius: number): string => {
  return `${radius.toString()} km`
}
const mockPlaces: SuggestedPlace[] = [
  {
    label: 'Kourou',
    info: 'Guyane',
    geolocation: { longitude: -52.669736, latitude: 5.16186 },
  },
]
const showModalMock = jest.fn()

jest.unmock('libs/geolocation')

jest.mock('libs/geolocation/getPosition')
const getPositionMock = getPosition as jest.MockedFunction<typeof getPosition>

jest.mock('libs/geolocation/requestGeolocPermission')
const mockRequestGeolocPermission = requestGeolocPermission as jest.MockedFunction<
  typeof requestGeolocPermission
>

jest.mock('libs/geolocation/checkGeolocPermission')
const mockCheckGeolocPermission = checkGeolocPermission as jest.MockedFunction<
  typeof checkGeolocPermission
>
mockCheckGeolocPermission.mockResolvedValue(GeolocPermissionState.GRANTED)

jest.mock('libs/place', () => ({
  usePlaces: () => ({ data: mockPlaces, isLoading: false }),
}))

const mockDispatch = jest.fn()
const mockSearchState: SearchState = {
  ...initialSearchState,
  locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: DEFAULT_RADIUS },
}

const useSearchSpy = jest
  .spyOn(useSearch, 'useSearch')
  .mockReturnValue({ searchState: mockSearchState, dispatch: mockDispatch })

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, push: jest.fn() }),
}))

describe('SearchLocationModal', () => {
  it('should render correctly if modal visible', async () => {
    renderSearchLocationModal()
    await waitForModalToShow()

    expect(screen).toMatchSnapshot()
  })

  it('should trigger logEvent "logUserSetLocation" on onSubmit', async () => {
    renderSearchLocationModal()
    await waitForModalToShow()

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
    await waitForModalToShow()

    fireEvent.press(screen.getByLabelText('Fermer la modale'))
    await waitFor(() => {
      expect(screen.queryByText('Localisation')).not.toBeOnTheScreen()
    })
  })

  it('should highlight geolocation button if geolocation is enabled', async () => {
    getPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    renderSearchLocationModal()
    await waitForModalToShow()

    expect(screen.getByText('Utiliser ma position actuelle')).toHaveStyle({ color: '#eb0055' })
  })

  it('should hide Géolocalisation désactivée if geolocation is enabled', async () => {
    getPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    renderSearchLocationModal()
    await waitForModalToShow()

    expect(screen.queryByText('Géolocalisation désactivée')).toBeNull()
  })

  it('should request geolocation if geolocation is denied and the geolocation button pressed', async () => {
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.DENIED)

    renderSearchLocationModal()
    await waitForModalToShow()

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
              showVenueModal={showModalMock}
            />
            <Button title="Close" onPress={() => setVisible(false)} />
          </React.Fragment>
        </LocationWrapper>
      )
    }
    render(<Container />)
    await waitForModalToShow()

    fireEvent.press(screen.getByText('Utiliser ma position actuelle'))

    await waitForModalToHide()
    await waitForModalToShow()

    expect(screen.getByText('Paramètres de localisation')).toBeOnTheScreen()
  })

  it('should navigate to Search page with place params when the user has selected a custom position', async () => {
    renderSearchLocationModal()

    await waitForModalToShow()

    const openLocationModalButton = screen.getByText('Choisir une localisation')
    fireEvent.press(openLocationModalButton)

    const searchInput = screen.getByTestId('styled-input-container')
    fireEvent.changeText(searchInput, mockPlaces[0].label)

    const suggestedPlace = await screen.findByText(mockPlaces[0].label)
    fireEvent.press(suggestedPlace)

    const validateButon = screen.getByText('Valider la localisation')
    fireEvent.press(validateButon)

    expect(mockNavigate).toHaveBeenCalledWith(
      ...getTabNavConfig('Search', {
        ...mockSearchState,
        locationFilter: {
          place: mockPlaces[0],
          locationType: LocationType.PLACE,
          aroundRadius: DEFAULT_RADIUS,
        },
        includeDigitalOffers: false,
      })
    )
  })

  it('should navigate to Search page with geolocation params when user is in geolocation mode', async () => {
    getPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    renderSearchLocationModal()
    await waitForModalToShow()

    const validateButon = screen.getByText('Valider la localisation')
    fireEvent.press(validateButon)

    expect(mockNavigate).toHaveBeenCalledWith(
      ...getTabNavConfig('Search', {
        ...mockSearchState,
        locationFilter: { locationType: LocationType.AROUND_ME, aroundRadius: DEFAULT_RADIUS },
        includeDigitalOffers: false,
      })
    )
  })

  describe('PlaceRadius', () => {
    it("should display default radius if it wasn't set previously", async () => {
      renderSearchLocationModal()
      await waitForModalToShow()

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
      await waitForModalToShow()

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
          includeDigitalOffers: false,
          locationFilter: {
            aroundRadius: mockRadiusPlace,
            locationType: LocationType.PLACE,
            place: mockPlaces[0],
          },
        },
        type: 'SET_LOCATION_FILTERS',
      })
    })

    it('should be init with the correct value located in the SearchState', async () => {
      useSearchSpy.mockReturnValueOnce({
        searchState: {
          ...initialSearchState,
          locationFilter: {
            place: mockPlaces[0],
            locationType: LocationType.PLACE,
            aroundRadius: mockRadiusPlace,
          },
        },
        dispatch: mockDispatch,
      })

      renderSearchLocationModal()
      await waitForModalToShow()
      const openLocationModalButton = screen.getByText('Choisir une localisation')
      fireEvent.press(openLocationModalButton)

      const searchInput = screen.getByTestId('styled-input-container')
      await act(async () => {
        fireEvent.changeText(searchInput, mockPlaces[0].label)
      })

      const suggestedPlace = await screen.findByText(mockPlaces[0].label)
      fireEvent.press(suggestedPlace)

      expect(screen.getByText(radiusWithKm(mockRadiusPlace))).toBeOnTheScreen()
    })

    it('should display default radius even if an AroundMeRadius was set previously', async () => {
      renderSearchLocationModal()
      await waitForModalToShow()

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
      renderSearchLocationModal()
      await waitForModalToShow()

      await waitFor(() => {
        expect(screen.getByText('Utiliser ma position actuelle')).toHaveStyle({ color: '#eb0055' })
      })

      expect(screen.getByText(radiusWithKm(DEFAULT_RADIUS))).toBeOnTheScreen()
    })

    it('should call searchContext dispatch with mockAroundMeRadius when pressing "Valider la localisation"', async () => {
      renderSearchLocationModal()
      await waitForModalToShow()

      await act(async () => {
        const slider = screen.getByTestId('slider').children[0] as ReactTestInstance
        slider.props.onValuesChange([mockAroundMeRadius])
      })

      fireEvent.press(screen.getByText('Valider la localisation'))

      expect(mockDispatch).toHaveBeenCalledWith({
        payload: {
          includeDigitalOffers: false,
          locationFilter: {
            aroundRadius: mockAroundMeRadius,
            locationType: LocationType.AROUND_ME,
          },
        },
        type: 'SET_LOCATION_FILTERS',
      })
    })

    it('should be init with the correct value located in the SearchState', async () => {
      useSearchSpy.mockReturnValueOnce({
        searchState: {
          ...initialSearchState,
          locationFilter: {
            locationType: LocationType.AROUND_ME,
            aroundRadius: mockAroundMeRadius,
          },
        },
        dispatch: mockDispatch,
      })

      renderSearchLocationModal()
      await waitForModalToShow()

      expect(screen.getByText(radiusWithKm(mockAroundMeRadius))).toBeOnTheScreen()
    })

    it('should display default radius even if a PlaceRadius was set previously', async () => {
      getPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })
      mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
      mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

      renderSearchLocationModal()
      await waitForModalToShow()

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
      <SearchLocationModal
        visible={visible}
        dismissModal={() => setVisible(false)}
        showVenueModal={showModalMock}
      />
    </React.Fragment>
  )
}
