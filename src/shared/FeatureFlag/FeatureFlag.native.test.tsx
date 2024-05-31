import React from 'react'
import { View } from 'react-native'

import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { FeatureFlag } from 'shared/FeatureFlag/FeatureFlag'
import { render, screen } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

describe('<FeatureFlag />', () => {
  it('should display children when feature flag activated', () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    renderView()

    expect(screen.getByTestId('FF-On')).toBeOnTheScreen()
    expect(screen.queryByTestId('FF-Off')).not.toBeOnTheScreen()
  })

  it('should not display childen when feature flag deactivated', () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    renderView()

    expect(screen.getByTestId('FF-Off')).toBeOnTheScreen()
    expect(screen.queryByTestId('FF-On')).not.toBeOnTheScreen()
  })
})

const renderView = () => {
  render(
    <FeatureFlag featureFlag="WIP_STEPPER_RETRY_UBBLE">
      <FeatureFlag.On>
        <View testID="FF-On" />
      </FeatureFlag.On>
      <FeatureFlag.Off>
        <View testID="FF-Off" />
      </FeatureFlag.Off>
    </FeatureFlag>
  )
}
