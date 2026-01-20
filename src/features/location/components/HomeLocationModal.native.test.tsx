import React from 'react'
import { Button } from 'react-native'

import { HomeLocationModal } from 'features/location/components/HomeLocationModal'
import { analytics } from 'libs/analytics/provider'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { requestGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import {
  checkGeolocPermission,
  GeolocPermissionState,
  LocationWrapper,
} from 'libs/location/location'
import { SuggestedPlace } from 'libs/place/types'
import { MODAL_TO_HIDE_TIME, MODAL_TO_SHOW_TIME } from 'tests/constants'
import { act, fireEvent, render, screen, userEvent } from 'tests/utils'

jest.useFakeTimers()

const hideModalMock = jest.fn()

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

jest.useFakeTimers()

describe('HomeLocationModal', () => {
  it('should render correctly if modal visible', async () => {
    renderHomeLocationModal()

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen).toMatchSnapshot()
  })

  it('should trigger logEvent "logUserSetLocation" on onSubmit', async () => {
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
    renderHomeLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    await user.press(screen.getByLabelText('Fermer la modale'))

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })

  it('should highlight geolocation button if geolocation is selected', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    renderHomeLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })
    const geolocPositionButton = screen.getByText('Utiliser ma position actuelle')
    await user.press(geolocPositionButton)

    expect(screen.getByText('Utiliser ma position actuelle')).toHaveStyle({ color: '#161617' })
  })

  it('should hide Géolocalisation désactivée if geolocation is enabled', async () => {
    getGeolocPositionMock.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

    renderHomeLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.queryByText('Géolocalisation désactivée')).toBeNull()
  })

  it('should request geolocation if geolocation is denied and the geolocation button pressed', async () => {
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.DENIED)

    renderHomeLocationModal()
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    await user.press(screen.getByText('Utiliser ma position actuelle'))

    expect(mockRequestGeolocPermission).toHaveBeenCalledTimes(1)
  })

  it('should show geolocation modal if geolocation is never_ask_again on closing the modal after a geolocation button press', async () => {
    mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.NEVER_ASK_AGAIN)
    hideModalMock.mockImplementationOnce(() => {
      // simulate the modal closing
      // userEvent.press not working correctly here
      // eslint-disable-next-line local-rules/no-fireEvent
      fireEvent.press(screen.getByText('Close'))
    })

    const Container = () => {
      const [visible, setVisible] = React.useState(true)
      return (
        <LocationWrapper>
          <React.Fragment>
            <HomeLocationModal visible={visible} dismissModal={hideModalMock} />
            <Button title="Close" onPress={() => setVisible(false)} />
          </React.Fragment>
        </LocationWrapper>
      )
    }
    render(<Container />)
    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    await user.press(screen.getByText('Utiliser ma position actuelle'))

    expect(hideModalMock).toHaveBeenCalledTimes(1)

    await act(async () => {
      jest.advanceTimersByTime(MODAL_TO_HIDE_TIME)
      jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)
    })

    expect(screen.getByText('Paramètres de localisation')).toBeOnTheScreen()
  })
})

function renderHomeLocationModal() {
  render(
    <LocationWrapper>
      <HomeLocationModal visible dismissModal={hideModalMock} />
    </LocationWrapper>
  )
}
