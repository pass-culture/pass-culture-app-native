import React from 'react'
import { Button } from 'react-native'

import { LocationModal } from 'features/location/components/LocationModal'
import { GeolocPermissionState, useLocation } from 'libs/geolocation'
import { fireEvent, render, screen, waitForModalToHide, waitForModalToShow } from 'tests/utils'

const hideModalMock = jest.fn()

jest.mock('libs/geolocation')
const mockUseLocation = useLocation as jest.MockedFunction<typeof useLocation>
const mockRequestGeolocPermission = jest.fn()
const mockShowGeolocPermissionModal = jest.fn()

const locationContextMock: ReturnType<typeof useLocation> = {
  userPosition: null,
  permissionState: GeolocPermissionState.DENIED,
  requestGeolocPermission: mockRequestGeolocPermission,
  showGeolocPermissionModal: mockShowGeolocPermissionModal,
  customPosition: null,
  setCustomPosition: jest.fn(),
  userPositionError: null,
  triggerPositionUpdate: jest.fn(),
  onPressGeolocPermissionModalButton: jest.fn(),
}
mockUseLocation.mockReturnValue(locationContextMock)

describe('LocationModal', () => {
  it('should render correctly if modal visible', async () => {
    renderLocationModal()
    await waitForModalToShow()

    expect(screen).toMatchSnapshot()
  })

  it('should hide modal on close modal button press', async () => {
    renderLocationModal()
    await waitForModalToShow()

    fireEvent.press(screen.getByLabelText('Fermer la modale'))

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })

  it('should highlight geolocation button if geolocation is enabled', async () => {
    mockUseLocation.mockReturnValueOnce({
      ...locationContextMock,
      userPosition: { latitude: 0, longitude: 0 },
    })
    renderLocationModal()
    await waitForModalToShow()

    expect(screen.getByText('Utiliser ma position actuelle')).toHaveStyle({ color: '#eb0055' })
  })

  it('should hide Géolocalisation désactivée if geolocation is enabled', async () => {
    mockUseLocation.mockReturnValueOnce({
      ...locationContextMock,
      userPosition: { latitude: 0, longitude: 0 },
    })
    renderLocationModal()
    await waitForModalToShow()

    expect(screen.queryByText('Géolocalisation désactivée')).toBeNull()
  })

  it('should request geolocation if geolocation is denied and the geolocation button pressed', async () => {
    renderLocationModal()
    await waitForModalToShow()

    fireEvent.press(screen.getByText('Utiliser ma position actuelle'))

    expect(mockRequestGeolocPermission).toHaveBeenCalledTimes(1)
  })

  it('should show geolocation modal if geolocation is never_ask_again on closing the modal after a geolocation button press', async () => {
    mockUseLocation.mockReturnValueOnce({
      ...locationContextMock,
      permissionState: GeolocPermissionState.NEVER_ASK_AGAIN,
    })
    hideModalMock.mockImplementationOnce(() => {
      // simulate the modal closing
      fireEvent.press(screen.getByText('Close'))
    })

    const Container = () => {
      const [visible, setVisible] = React.useState(true)
      return (
        <React.Fragment>
          <LocationModal visible={visible} dismissModal={hideModalMock} />
          <Button title="Close" onPress={() => setVisible(false)} />
        </React.Fragment>
      )
    }
    render(<Container />)
    await waitForModalToShow()

    fireEvent.press(screen.getByText('Utiliser ma position actuelle'))

    expect(hideModalMock).toHaveBeenCalledTimes(1)

    await waitForModalToHide()

    expect(mockShowGeolocPermissionModal).toHaveBeenCalledTimes(1)
  })
})

function renderLocationModal() {
  render(<LocationModal visible dismissModal={hideModalMock} />)
}
