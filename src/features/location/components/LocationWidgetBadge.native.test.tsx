import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { LocationWidgetBadge } from 'features/location/components/LocationWidgetBadge'
import { LocationLabel, LocationMode } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { act, render, screen, userEvent } from 'tests/utils'

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    dispatch: jest.fn(),
  }),
}))

const user = userEvent.setup()

jest.useFakeTimers()

describe('LocationWidgetBadge', () => {
  beforeEach(() => {
    useLocationV2.setState(defaultLocationState)
  })

  it('should navigate to search location modal when pressing widget', async () => {
    render(<LocationWidgetBadge />)

    const button = screen.getByLabelText('France entière - Ouvrir la modale de localisation')

    await user.press(button)

    expect(navigate).toHaveBeenCalledWith('SearchLocationModal')
  })

  it(`should render a filled location pointer and the text ${LocationLabel.aroundMeLabel} if the user is geolocated`, async () => {
    await act(async () => {
      locationActions.setGeolocPosition({ latitude: 48.8566, longitude: 2.3522 })
      locationActions.setLocationMode(LocationMode.AROUND_ME)
    })

    render(<LocationWidgetBadge />)

    expect(screen.getByTestId('location pointer highlighted')).toBeOnTheScreen()
    expect(screen.getByText(LocationLabel.aroundMeLabel)).toBeOnTheScreen()
  })

  it(`should render a location pointer(not filled ) and the text ${LocationLabel.everywhereLabel} if the user is not geolocated and has not selected a custom position`, async () => {
    await act(async () => {
      locationActions.setGeolocPosition(null)
      locationActions.setLocationMode(LocationMode.EVERYWHERE)
    })

    render(<LocationWidgetBadge />)

    expect(screen.getByTestId('location pointer default')).toBeOnTheScreen()
    expect(screen.getByText(LocationLabel.everywhereLabel)).toBeOnTheScreen()
  })

  it('should render a filled location pointer and label of the place if the user has selected a place', async () => {
    await act(async () => {
      locationActions.setPlace({
        label: 'my place',
        info: '',
        type: 'locality',
        geolocation: { latitude: 0, longitude: 0 },
      })
      locationActions.setLocationMode(LocationMode.AROUND_PLACE)
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
