import React from 'react'

import { VenueMapModule } from 'features/home/components/modules/VenueMapModule'
import { analytics } from 'libs/analytics/provider'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { render, screen, userEvent } from 'tests/utils'

const mockedPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

const mockHasGeolocPosition = true
const mockSelectedLocationMode = LocationMode.AROUND_ME

const mockUseLocation = jest.fn(() => ({
  hasGeolocPosition: mockHasGeolocPosition,
  selectedLocationMode: mockSelectedLocationMode,
  place: mockedPlace,
}))
jest.mock('libs/location/location', () => ({
  useLocation: () => mockUseLocation(),
}))

const user = userEvent.setup()

jest.useFakeTimers()

describe('VenueMapModule', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
  })

  it('should render venue map block when user is located and feature flag enabled', () => {
    render(<VenueMapModule />)

    expect(screen.getByText('Explore la carte')).toBeOnTheScreen()
  })

  it('should not render venue map block when feature flag is disabled', () => {
    setFeatureFlags()
    render(<VenueMapModule />)

    expect(screen.queryByText('Carte des lieux culturels')).not.toBeOnTheScreen()
  })

  it('should not render venue map block when user is not located', () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: false,
      selectedLocationMode: mockSelectedLocationMode,
      place: mockedPlace,
    })
    render(<VenueMapModule />)

    expect(screen.queryByText('Carte des lieux culturels')).not.toBeOnTheScreen()
  })

  it('should not render venue map block when user is located everywhere', () => {
    mockUseLocation.mockReturnValueOnce({
      hasGeolocPosition: mockHasGeolocPosition,
      selectedLocationMode: LocationMode.EVERYWHERE,
      place: mockedPlace,
    })
    render(<VenueMapModule />)

    expect(screen.queryByText('Carte des lieux culturels')).not.toBeOnTheScreen()
  })

  it('should log consult venue map from home when pressing venue map block', async () => {
    render(<VenueMapModule />)

    await user.press(screen.getByText('Explore la carte'))

    expect(analytics.logConsultVenueMap).toHaveBeenNthCalledWith(1, { from: 'home' })
  })
})
