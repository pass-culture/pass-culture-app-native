import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { LocationWidgetBadge } from 'features/location/components/LocationWidgetBadge'
import { useLocation } from 'libs/location/location'
import { LocationLabel, LocationMode } from 'libs/location/types'
import { act, render, screen, userEvent } from 'tests/utils'

jest.mock('libs/location/location')
const mockUseLocation = useLocation as jest.Mock

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    dispatch: jest.fn(),
  }),
}))

const user = userEvent.setup()

jest.useFakeTimers()

describe('LocationWidgetBadge', () => {
  it('should navigate to location modal when pressing widget', async () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: true,
      place: { label: 'test' },
    })
    render(<LocationWidgetBadge />)

    const button = screen.getByTestId('LocationWidgetBadgeButton')

    await user.press(button)

    expect(navigate).toHaveBeenCalledTimes(1)
  })

  it.each`
    hasGeolocPosition | place
    ${true}           | ${null}
    ${true}           | ${undefined}
  `(
    `should render a filled location pointer and the text ${LocationLabel.aroundMeLabel} if the user is geolocated`,
    async ({ hasGeolocPosition, place }) => {
      mockUseLocation.mockReturnValueOnce({
        hasGeolocPosition,
        place,
        selectedLocationMode: LocationMode.AROUND_ME,
      })

      render(<LocationWidgetBadge />)

      expect(screen.getByTestId('location pointer highlighted')).toBeOnTheScreen()
      expect(screen.getByText(LocationLabel.aroundMeLabel)).toBeOnTheScreen()
    }
  )

  it.each`
    hasGeolocPosition | place
    ${false}          | ${null}
    ${false}          | ${undefined}
  `(
    `should render a location pointer(not filled ) and the text ${LocationLabel.everywhereLabel} if the user is not geolocated and has not selected a custom position`,
    async ({ hasGeolocPosition, place }) => {
      mockUseLocation.mockReturnValueOnce({
        hasGeolocPosition,
        place,
        geolocPosition: null,
        selectedLocationMode: LocationMode.EVERYWHERE,
      })

      render(<LocationWidgetBadge />)

      expect(screen.getByTestId('location pointer default')).toBeOnTheScreen()
      expect(screen.getByText(LocationLabel.everywhereLabel)).toBeOnTheScreen()
    }
  )

  it('should render a filled location pointer and label of the place if the user has selected a place', async () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: true,
      place: { label: 'my place' },
      geolocPosition: null,
      selectedLocationMode: LocationMode.AROUND_PLACE,
    })

    render(<LocationWidgetBadge />)

    expect(screen.getByTestId('location pointer highlighted')).toBeOnTheScreen()
    expect(screen.getByText('my place')).toBeOnTheScreen()
  })

  it('should not display tooltip on the search widget', async () => {
    jest.useFakeTimers()
    render(
      <NavigationContainer>
        <LocationWidgetBadge />
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
