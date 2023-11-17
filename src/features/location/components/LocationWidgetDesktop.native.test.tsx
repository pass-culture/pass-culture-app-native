import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { LocationWidgetDesktop } from 'features/location/components/LocationWidgetDesktop'
import { useLocation } from 'libs/geolocation'
import { storage } from 'libs/storage'
import { act, fireEvent, render, screen } from 'tests/utils'

jest.unmock('@react-navigation/native')

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

describe('LocationWidgetDesktop', () => {
  it('should show modal when pressing widget', async () => {
    mockUseGeolocation.mockReturnValueOnce({
      isGeolocated: true,
      isCustomPosition: true,
      place: { label: 'test' },
    })
    renderLocationWidgetDesktop()

    const button = screen.getByTestId('Ouvrir la modale de localisation depuis le titre')

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

      renderLocationWidgetDesktop()

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

      renderLocationWidgetDesktop()

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

    renderLocationWidgetDesktop()

    expect(screen.getByTestId('location pointer filled')).toBeOnTheScreen()
    expect(screen.getByText('my place')).toBeOnTheScreen()
  })

  describe('tooltip', () => {
    mockUseGeolocation.mockReturnValue({
      isGeolocated: true,
      isCustomPosition: undefined,
      place: null,
      userPosition: null,
      onModalHideRef: jest.fn(),
    })

    afterEach(async () => storageResetDisplayedTooltip())

    it('should hide tooltip when pressing close button', async () => {
      jest.useFakeTimers({ legacyFakeTimers: true })
      renderLocationWidgetDesktop()

      await act(async () => {
        jest.advanceTimersByTime(1000)
      })

      const closeButton = screen.getByLabelText('Fermer le tooltip')

      fireEvent.press(closeButton)

      expect(
        screen.queryByText(
          'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
        )
      ).not.toBeOnTheScreen()
    })

    it('should show tooltip after 1 second', async () => {
      jest.useFakeTimers({ legacyFakeTimers: true })
      renderLocationWidgetDesktop()

      await act(async () => {
        jest.advanceTimersByTime(1000)
      })

      expect(
        screen.getByText(
          'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
        )
      ).toBeOnTheScreen()
    })

    it('should hide tooltip 8 seconds after it appeared', async () => {
      jest.useFakeTimers({ legacyFakeTimers: true })
      renderLocationWidgetDesktop()

      await act(async () => {
        jest.advanceTimersByTime(1000)
      })

      screen.getByText(
        'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
      )

      await act(async () => {
        jest.advanceTimersByTime(8000)
      })

      expect(
        screen.queryByText(
          'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
        )
      ).not.toBeOnTheScreen()
    })

    it('should hide tooltip when taping “Me localiser”', async () => {
      jest.useFakeTimers({ legacyFakeTimers: true })
      renderLocationWidgetDesktop()

      await act(async () => {
        jest.advanceTimersByTime(1000)
      })

      screen.getByText(
        'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
      )

      const locationButton = screen.getByText('Me localiser')
      fireEvent.press(locationButton)

      expect(
        screen.queryByText(
          'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
        )
      ).not.toBeOnTheScreen()
    })
  })
})

const renderLocationWidgetDesktop = () => {
  render(
    <NavigationContainer>
      <LocationWidgetDesktop />
    </NavigationContainer>
  )
}

const storageResetDisplayedTooltip = async () => {
  await storage.saveString('times_location_tooltip_has_been_displayed', '0')
}
