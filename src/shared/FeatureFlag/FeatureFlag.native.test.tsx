import React from 'react'
import { View } from 'react-native'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { FeatureFlag } from 'shared/FeatureFlag/FeatureFlag'
import { render, screen } from 'tests/utils'

describe('<FeatureFlag />', () => {
  const children = <View testID="children" />

  it('should display children when feature flag activated', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_STEPPER_RETRY_UBBLE])
    render(
      <FeatureFlag featureFlag={RemoteStoreFeatureFlags.WIP_STEPPER_RETRY_UBBLE}>
        {children}
      </FeatureFlag>
    )

    expect(screen.getByTestId('children')).toBeOnTheScreen()
  })

  it('should not display childen when feature flag deactivated', () => {
    setFeatureFlags()
    render(
      <FeatureFlag featureFlag={RemoteStoreFeatureFlags.WIP_STEPPER_RETRY_UBBLE}>
        {children}
      </FeatureFlag>
    )

    expect(screen.queryByTestId('children')).not.toBeOnTheScreen()
  })
})
