import React, { FC, PropsWithChildren, ReactNode } from 'react'
import { View } from 'react-native'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

type FeatureFlagProps = {
  featureFlag: keyof typeof RemoteStoreFeatureFlags
  children: ReactNode
}

type SubComponentProps = PropsWithChildren

/**
 * FeatureFlag component to conditionally render children based on the feature flag state.
 *
 * @param {keyof RemoteStoreFeatureFlags} featureFlag - The name of the feature flag to check.
 * @param {ReactNode} children - The children components, typically `FeatureFlag.On` and `FeatureFlag.Off`.
 * @example
 * <FeatureFlag featureFlag={RemoteStoreFeatureFlags.WIP_APP_V2_CATEGORY_BLOCK}>
 *   <FeatureFlag.On>
 *     <View>
 *       <Text>Feature is ON</Text>
 *     </View>
 *   </FeatureFlag.On>
 *   <FeatureFlag.Off>
 *     <View>
 *       <Text>Feature is OFF</Text>
 *     </View>
 *   </FeatureFlag.Off>
 * </FeatureFlag>
 */
const FeatureFlagComponent: FC<FeatureFlagProps> & {
  On: FC<SubComponentProps>
  Off: FC<SubComponentProps>
} = ({ featureFlag, children }) => {
  const isEnabled = useFeatureFlag(RemoteStoreFeatureFlags[featureFlag])

  return (
    <View>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null
        }

        if (child.type === FeatureFlagComponent.On && isEnabled) {
          return child
        }

        if (child.type === FeatureFlagComponent.Off && !isEnabled) {
          return child
        }

        return null
      })}
    </View>
  )
}

const On: FC<SubComponentProps> = ({ children }) => <View>{children}</View>

const Off: FC<SubComponentProps> = ({ children }) => <View>{children}</View>

FeatureFlagComponent.On = On
FeatureFlagComponent.Off = Off

export const FeatureFlag = FeatureFlagComponent
