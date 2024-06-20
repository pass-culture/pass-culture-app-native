import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { LocationWidget } from 'features/location/components/LocationWidget'
import { ScreenOrigin } from 'features/location/enums'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { act, fireEvent, render, screen } from 'tests/utils/web'

jest.unmock('@react-navigation/native')
jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

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
        <LocationWidget screenOrigin={ScreenOrigin.HOME} />
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
