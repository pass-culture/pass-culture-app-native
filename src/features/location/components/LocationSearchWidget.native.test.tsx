import React from 'react'

import { LocationSearchWidget } from 'features/location/components/LocationSearchWidget'
import { useLocation } from 'libs/geolocation'
import { fireEvent, render, screen } from 'tests/utils'

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
describe('LocationSearchWidget', () => {
  it('should show modal when pressing widget', async () => {
    mockUseGeolocation.mockReturnValueOnce({
      isGeolocated: true,
      isCustomPosition: true,
      place: { label: 'test' },
    })
    render(<LocationSearchWidget />)

    const button = screen.getByTestId('Ouvrir la modale de localisation')

    fireEvent.press(button)
    expect(mockShowModal).toHaveBeenCalledTimes(1)
  })

  it.each`
    isGeolocated | isCustomPosition | isLocationPointerFilled
    ${true}      | ${true}          | ${true}
    ${false}     | ${true}          | ${true}
    ${true}      | ${false}         | ${true}
    ${false}     | ${false}         | ${false}
    ${true}      | ${undefined}     | ${true}
    ${false}     | ${undefined}     | ${false}
  `(
    'should render a filled location pointer if the use is geolocated($isGeolocated) or if he has a custom position($isCustomPosition) ',
    async ({ isGeolocated, isCustomPosition, isLocationPointerFilled }) => {
      mockUseGeolocation.mockReturnValueOnce({
        isGeolocated,
        isCustomPosition,
        place: { label: 'test' },
      })
      const testID = isLocationPointerFilled
        ? 'location pointer filled'
        : 'location pointer not filled'
      render(<LocationSearchWidget />)

      expect(screen.getByTestId(testID)).toBeOnTheScreen()
    }
  )
})
