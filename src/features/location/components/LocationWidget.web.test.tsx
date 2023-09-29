import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { LocationWidget } from 'features/location/components/LocationWidget'
import { act, fireEvent, render, screen } from 'tests/utils/web'

jest.unmock('@react-navigation/native')

describe('LocationWidget', () => {
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
        <LocationWidget enableTooltip />
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
