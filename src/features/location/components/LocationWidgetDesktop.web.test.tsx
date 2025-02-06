import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { LocationWidgetDesktop } from 'features/location/components/LocationWidgetDesktop'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { act, fireEvent, render, screen } from 'tests/utils/web'

jest.unmock('@react-navigation/native')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('LocationWidgetDesktop', () => {
  beforeEach(() => {
    setFeatureFlags() // TODO(PC-34435): add tests for WIP_APP_V2_LOCATION_WIDGET
  })

  afterEach(async () => {
    await act(async () => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it('should hide tooltip when pressing close button', async () => {
    jest.useFakeTimers()
    render(
      <NavigationContainer>
        <LocationWidgetDesktop />
      </NavigationContainer>
    )

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    expect(
      screen.getByText(
        'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
      )
    ).toBeInTheDocument()

    const tooltip = screen.getByRole('tooltip')
    fireEvent.keyDown(tooltip, { key: 'Escape', keyCode: 27 })

    expect(
      screen.queryByText(
        'Configure ta position et découvre les offres dans la zone géographique de ton choix.'
      )
    ).not.toBeInTheDocument()
  })
})
