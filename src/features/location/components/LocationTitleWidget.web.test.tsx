import React from 'react'

import { LocationTitleWidget } from 'features/location/components/LocationTitleWidget.web'
import { useLocation } from 'libs/geolocation'
import { fireEvent, render, screen } from 'tests/utils/web'

const mockShowModal = jest.fn()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
  }),
}))

jest.mock('libs/geolocation')
const mockUseGeolocation = useLocation as jest.Mock
describe('LocationTitleWidget', () => {
  it('should show modal when pressing widget', async () => {
    mockUseGeolocation.mockReturnValueOnce({
      isGeolocated: true,
      isCustomPosition: true,
      place: { label: 'test' },
    })
    render(<LocationTitleWidget />)

    const button = screen.getByTestId('Ouvrir la modale de localisation depuis le titre')

    fireEvent.click(button)
    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it.each`
    isGeolocated | isCustomPosition
    ${true}      | ${false}
    ${true}      | ${undefined}
  `(
    "should render a filled location pointer and the text 'Ma position' if the user is geolocated",
    async ({ isGeolocated, isCustomPosition }) => {
      mockUseGeolocation.mockReturnValueOnce({
        isGeolocated,
        isCustomPosition,
        place: null,
      })

      render(<LocationTitleWidget />)

      expect(screen.getByTestId('location pointer filled')).toBeInTheDocument()
      expect(screen.getByText('Ma position')).toBeInTheDocument()
    }
  )

  it.each`
    isGeolocated | isCustomPosition
    ${false}     | ${false}
    ${false}     | ${undefined}
  `(
    "should render a location pointer(not filled ) and the text 'Me localiser' if the user is not geolocated and has not selected a custom position",
    async ({ isGeolocated, isCustomPosition }) => {
      mockUseGeolocation.mockReturnValueOnce({
        isGeolocated,
        isCustomPosition,
        place: null,
        userPosition: null,
      })

      render(<LocationTitleWidget />)

      expect(screen.getByTestId('location pointer not filled')).toBeInTheDocument()
      expect(screen.getByText('Me localiser')).toBeInTheDocument()
    }
  )

  it('should render a filled location pointer and label of the place if the user has selected a custom place', async () => {
    mockUseGeolocation.mockReturnValueOnce({
      isGeolocated: true,
      isCustomPosition: true,
      place: { label: 'my place' },
      userPosition: null,
    })

    render(<LocationTitleWidget />)

    expect(screen.getByTestId('location pointer filled')).toBeInTheDocument()
    expect(screen.getByText('my place')).toBeInTheDocument()
  })
})
