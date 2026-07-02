import React from 'react'
import { Linking } from 'react-native'

import { analytics } from 'libs/analytics/provider'
import { GeolocationActivationModal } from 'libs/location/components/GeolocationActivationModal'
import { render, screen, userEvent } from 'tests/utils'

const mockGoBack = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...(jest.requireActual('@react-navigation/native') as Record<string, unknown>),
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()

describe('GeolocationActivationModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render properly', () => {
    renderGeolocationActivationModal()

    expect(screen).toMatchSnapshot()
  })

  it('should go back when pressing close icon', async () => {
    renderGeolocationActivationModal()

    await user.press(screen.getByLabelText('Fermer la modale'))

    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })

  it('should open settings to activate geoloc when press on "Activer la géolocalisation"', async () => {
    jest.spyOn(Linking, 'openSettings').mockResolvedValueOnce(undefined as unknown as void)
    renderGeolocationActivationModal()

    await user.press(screen.getByText('Activer la géolocalisation'))

    expect(Linking.openSettings).toHaveBeenCalledTimes(1)
    expect(analytics.logOpenLocationSettings).toHaveBeenCalledTimes(1)
  })
})

function renderGeolocationActivationModal() {
  render(<GeolocationActivationModal />)
}
