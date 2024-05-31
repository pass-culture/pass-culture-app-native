import React, { createContext, FC, PropsWithChildren, ReactNode, useContext, useMemo } from 'react'

import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

type FeatureFlagContextValue = {
  isEnabled: boolean
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | undefined>(undefined)

type FeatureFlagProviderProps = {
  featureFlag: keyof typeof RemoteStoreFeatureFlags
  children: ReactNode
}

/**
 * FeatureFlagProvider component to provide the feature flag state via context.
 *
 * @param {keyof RemoteStoreFeatureFlags} featureFlag - The name of the feature flag to check.
 * @param {ReactNode} children - The children components.
 * @example
 * <FeatureFlagProvider featureFlag={RemoteStoreFeatureFlags.WIP_APP_V2_CATEGORY_BLOCK}>
 *   <View>
 *     <Text>Feature is ON or OFF</Text>
 *     <FeatureFlag.On>
 *       <Text>Feature is ON</Text>
 *     </FeatureFlag.On>
 *     <FeatureFlag.Off>
 *       <Text>Feature is OFF</Text>
 *     </FeatureFlag.Off>
 *   </View>
 * </FeatureFlagProvider>
 */
const FeatureFlagProvider: FC<FeatureFlagProviderProps> = ({ featureFlag, children }) => {
  const isEnabled = useFeatureFlag(RemoteStoreFeatureFlags[featureFlag])

  const value = useMemo(() => ({ isEnabled }), [isEnabled])

  return <FeatureFlagContext.Provider value={value}>{children}</FeatureFlagContext.Provider>
}

const useFeatureFlagContext = () => {
  const context = useContext(FeatureFlagContext)
  if (context === undefined) {
    throw new Error(
      '<FeatureFlag.On /> and <FeatureFlag.Off /> must be wrapped within a <FeatureFlag /> component'
    )
  }
  return context
}

type SubComponentProps = PropsWithChildren

const On: FC<SubComponentProps> = ({ children }) => {
  const { isEnabled } = useFeatureFlagContext()
  return isEnabled ? <React.Fragment>{children}</React.Fragment> : null
}

const Off: FC<SubComponentProps> = ({ children }) => {
  const { isEnabled } = useFeatureFlagContext()
  return isEnabled ? null : <React.Fragment>{children}</React.Fragment>
}

const FeatureFlagComponent: FC<FeatureFlagProviderProps> & {
  On: FC<SubComponentProps>
  Off: FC<SubComponentProps>
} = FeatureFlagProvider as FC<FeatureFlagProviderProps> & {
  On: FC<SubComponentProps>
  Off: FC<SubComponentProps>
}

FeatureFlagComponent.On = On
FeatureFlagComponent.Off = Off

export const FeatureFlag = FeatureFlagComponent
