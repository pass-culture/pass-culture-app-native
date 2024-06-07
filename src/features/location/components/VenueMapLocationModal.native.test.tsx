import React, { useState } from 'react'
import { Button } from 'react-native'
import { ReactTestInstance } from 'react-test-renderer'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchLocationModal } from 'features/location/components/SearchLocationModal'
import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { DEFAULT_RADIUS } from 'features/search/constants'
import { analytics } from 'libs/analytics'
import { checkGeolocPermission, GeolocPermissionState, LocationWrapper } from 'libs/location'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { requestGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import { SuggestedPlace } from 'libs/place/types'
import { MODAL_TO_HIDE_TIME, MODAL_TO_SHOW_TIME } from 'tests/constants'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

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

jest.mock('libs/place/usePlaces', () => ({
  usePlaces: () => ({ data: mockPlaces, isLoading: false }),
}))

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    dispatch: jest.fn(),
  }),
}))

describe('VenueMapLocationModal', () => {
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
    const openLocationModalButton = screen.getByText('Choisir une localisation')
    fireEvent.press(openLocationModalButton)

    const searchInput = screen.getByTestId('styled-input-container')
    fireEvent.changeText(searchInput, mockPlaces[0].label)

    const suggestedPlace = await screen.findByText(mockPlaces[0].label)
    fireEvent.press(suggestedPlace)

    const validateButon = screen.getByText('Valider et voir sur la carte')
    fireEvent.press(validateButon)

    expect(analytics.logUserSetLocation).toHaveBeenCalledWith('venueMap')
  })

  it('should hide modal on close modal button press', async () => {
    renderVenueMapLocationModal()
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

    renderVenueMapLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    const geolocPositionButton = screen.getByText('Utiliser ma position actuelle')
    await act(() => {
      fireEvent.press(geolocPositionButton)
    })

    expect(screen.getByText('Utiliser ma position actuelle')).toHaveStyle({ color: '#eb0055' })
  })

  it('should hide "Géolocalisation désactivée" if geolocation is enabled', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    renderVenueMapLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.queryByText('Géolocalisation désactivée')).toBeNull()
  })

  it('should navigate to venue map on submit when we choose a location', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })
    mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

    renderVenueMapLocationModal()
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

    const validateButon = screen.getByText('Valider et voir sur la carte')
    fireEvent.press(validateButon)

    expect(navigate).toHaveBeenNthCalledWith(1, 'VenueMap', {})
  })

  it('should request geolocation if geolocation is denied and the geolocation button pressed', async () => {
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.DENIED)

    renderVenueMapLocationModal()
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
      renderVenueMapLocationModal()
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

    it('should display default radius even if an AroundMeRadius was set previously', async () => {
      mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
      renderVenueMapLocationModal()
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
      renderVenueMapLocationModal()
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

    it('should display default radius even if a PlaceRadius was set previously', async () => {
      getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })
      mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
      mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

      renderVenueMapLocationModal()
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

      const validateButon = screen.getByText('Valider et voir sur la carte')
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

function renderVenueMapLocationModal() {
  render(
    <LocationWrapper>
      <VenueMapLocationModalWithMockButton />
    </LocationWrapper>
  )
}

const VenueMapLocationModalWithMockButton = () => {
  const [visible, setVisible] = useState<boolean>(true)

  return (
    <React.Fragment>
      <Button title="Open modal" onPress={() => setVisible(true)} />
      <VenueMapLocationModal visible={visible} dismissModal={() => setVisible(false)} />
    </React.Fragment>
  )
}
