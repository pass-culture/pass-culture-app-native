import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { LocationSearchWidget } from 'features/location/components/LocationSearchWidget'
import { useLocation } from 'libs/location'
import { act, fireEvent, render, screen } from 'tests/utils'

const mockShowModal = jest.fn()
jest.mock('ui/components/modals/useModal', () => ({
  useModal: () => ({
    visible: false,
    showModal: mockShowModal,
    hideModal: jest.fn(),
  }),
}))

jest.mock('libs/location')
const mockUseGeolocation = useLocation as jest.Mock

describe('LocationSearchWidget', () => {
  it('should show modal when pressing widget', async () => {
    mockUseGeolocation.mockReturnValueOnce({
      isGeolocated: true,
      isCustomPosition: true,
      place: { label: 'test' },
    })
    render(<LocationSearchWidget />)

    const button = screen.getByTestId('Ouvrir la modale de localisation depuis la recherche')

    fireEvent.press(button)

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

      render(<LocationSearchWidget />)

      expect(screen.getByTestId('location pointer filled')).toBeOnTheScreen()
      expect(screen.getByText('Ma position')).toBeOnTheScreen()
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

      render(<LocationSearchWidget />)

      expect(screen.getByTestId('location pointer not filled')).toBeOnTheScreen()
      expect(screen.getByText('Me localiser')).toBeOnTheScreen()
    }
  )

  it('should render a filled location pointer and label of the place if the user has selected a custom place', async () => {
    mockUseGeolocation.mockReturnValueOnce({
      isGeolocated: true,
      isCustomPosition: true,
      place: { label: 'my place' },
      userPosition: null,
    })

    render(<LocationSearchWidget />)

    expect(screen.getByTestId('location pointer filled')).toBeOnTheScreen()
    expect(screen.getByText('my place')).toBeOnTheScreen()
  })

  it('should not display tooltip on the search widget', async () => {
    jest.useFakeTimers()
    render(
      <NavigationContainer>
        <LocationSearchWidget />
      </NavigationContainer>
    )

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    expect(
      screen.queryByText(
        'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
      )
    ).not.toBeOnTheScreen()

    expect(screen.queryByRole('tooltip')).not.toBeOnTheScreen()
  })
})
