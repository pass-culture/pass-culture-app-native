import React from 'react'

import { HomeLocationModal } from 'features/location/components/HomeLocationModal'
import { analytics } from 'libs/analytics/provider'
import { GeolocationActivationModal } from 'libs/location/geolocation/components/GeolocationActivationModal'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { requestGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import {
  checkGeolocPermission,
  GeolocPermissionState,
  LocationWrapper,
} from 'libs/location/location'
import { initLocationPermission } from 'libs/locationV2/location.methods'
import { locationModalActions } from 'libs/locationV2/locationModal.store'
import { SuggestedPlace } from 'libs/place/types'
import { MODAL_TO_HIDE_TIME, MODAL_TO_SHOW_TIME } from 'tests/constants'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'
import { Button } from 'ui/designSystem/Button/Button'

jest.useFakeTimers()

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

const mockPlaces = [
  {
    label: 'Kourou',
    info: 'Guyane',
    type: 'street',
    geolocation: { longitude: -52.669736, latitude: 5.16186 },
  },
] as const satisfies readonly SuggestedPlace[]

jest.mock('libs/place/queries/usePlacesQuery', () => ({
  usePlacesQuery: () => ({ data: mockPlaces, isLoading: false }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

describe('HomeLocationModal', () => {
  it('should render correctly if modal visible', async () => {
    act(() => {
      locationModalActions.show()
      initLocationPermission()
    })
    renderHomeLocationModal()

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen).toMatchSnapshot()
  })

  it('should trigger logEvent "logUserSetLocation" on onSubmit', async () => {
    act(() => {
      locationModalActions.show()
      initLocationPermission()
    })
    renderHomeLocationModal()
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

    const validateButon = screen.getByText('Valider la localisation')
    await user.press(validateButon)

    expect(analytics.logUserSetLocation).toHaveBeenCalledWith('home')
  })

  it('should hide modal on close modal button press', async () => {
    act(() => {
      locationModalActions.show()
      initLocationPermission()
    })
    renderHomeLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    await user.press(screen.getByLabelText('Fermer la modale'))

    await waitFor(() => {
      expect(screen.queryByText('Localisation')).not.toBeOnTheScreen()
    })
  })

  it('should hide Géolocalisation désactivée if geolocation is enabled', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })
    act(() => {
      locationModalActions.show()
      initLocationPermission()
    })

    renderHomeLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.queryByText('Géolocalisation désactivée')).toBeNull()
  })

  it('should request geolocation if geolocation is denied and the geolocation button pressed', async () => {
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.DENIED)
    act(() => {
      locationModalActions.show()
      initLocationPermission()
    })

    renderHomeLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    await user.press(screen.getByText('Utiliser ma position actuelle'))

    expect(mockRequestGeolocPermission).toHaveBeenCalledTimes(1)
  })

  it('should show geolocation modal if geolocation is never_ask_again on closing the modal after a geolocation button press', async () => {
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.NEVER_ASK_AGAIN)
    act(() => {
      locationModalActions.show()
      initLocationPermission()
    })

    const Container = () => {
      return (
        <LocationWrapper>
          <React.Fragment>
            <GeolocationActivationModal />
            <HomeLocationModal />
            <Button wording="Close" onPress={locationModalActions.hide} />
          </React.Fragment>
        </LocationWrapper>
      )
    }
    render(<Container />)
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    await user.press(screen.getByText('Utiliser ma position actuelle'))

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_HIDE_TIME)
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    await waitFor(() => {
      expect(screen.queryByText('Localisation')).not.toBeOnTheScreen()
    })

    expect(screen.getByText('Paramètres de localisation')).toBeOnTheScreen()
  })
})

function renderHomeLocationModal() {
  render(
    <LocationWrapper>
      <React.Fragment>
        <GeolocationActivationModal />
        <HomeLocationModal />
      </React.Fragment>
    </LocationWrapper>
  )
}
