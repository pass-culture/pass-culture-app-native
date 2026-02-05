import React from 'react'

import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

import { LocationButton } from './LocationButton'

jest.mock('ui/hooks/useDebounce', () => ({ useDebounce: (value: string) => value }))

const mockSwitchGeolocation = jest.fn()

const user = userEvent.setup()
jest.useFakeTimers()

describe('LocationButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly with geoloc active and no error', () => {
    render(
      <LocationButton
        isGeolocSwitchActive
        geolocPositionError={null}
        switchGeolocation={mockSwitchGeolocation}
      />
    )

    expect(
      screen.getByLabelText('Activer ma géolocalisation - Interrupteur à bascule - coché')
    ).toBeTruthy()
  })

  it('should display error message if geolocPositionError is set', async () => {
    const error = { message: 'Erreur de géolocalisation' }

    render(
      <LocationButton
        isGeolocSwitchActive={false}
        geolocPositionError={error}
        switchGeolocation={mockSwitchGeolocation}
      />
    )

    const errorMessage = await screen.findByHintText('Erreur de géolocalisation')

    expect(errorMessage).toBeTruthy()
  })

  it('should call switchGeolocation and logLocationToggle on toggle', async () => {
    render(
      <LocationButton
        isGeolocSwitchActive={false}
        geolocPositionError={null}
        switchGeolocation={mockSwitchGeolocation}
      />
    )

    const toggle = screen.getByLabelText(
      'Activer ma géolocalisation - Interrupteur à bascule - non coché'
    )

    await user.press(toggle)

    expect(mockSwitchGeolocation).toHaveBeenCalledTimes(1)
    expect(analytics.logLocationToggle).toHaveBeenCalledWith(true)
  })
})
