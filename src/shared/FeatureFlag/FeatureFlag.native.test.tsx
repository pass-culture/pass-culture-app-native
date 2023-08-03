import React from 'react'
import { View } from 'react-native'

import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { FeatureFlag } from 'shared/FeatureFlag/FeatureFlag'
import { render, screen } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

describe('<FeatureFlag />', () => {
  const children = <View testID="children" />

  it('should display children when feature flag activated', () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    render(
      <FeatureFlag featureFlag={RemoteStoreFeatureFlags.WIP_STEPPER_RETRY_UBBLE}>
        {children}
      </FeatureFlag>
    )
    expect(screen.getByTestId('children')).toBeTruthy()
  })

  it('should not display childen when feature flag deactivated', () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    render(
      <FeatureFlag featureFlag={RemoteStoreFeatureFlags.WIP_STEPPER_RETRY_UBBLE}>
        {children}
      </FeatureFlag>
    )
    expect(screen.queryByTestId('children')).toBeNull()
  })
})
