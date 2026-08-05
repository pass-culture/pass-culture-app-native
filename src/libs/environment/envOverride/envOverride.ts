import AsyncStorage from '@react-native-async-storage/async-storage'

import { env } from 'libs/environment/env'
import { ENV_OVERRIDE_CONFIG } from 'libs/environment/envOverride/envOverrideConfig'
import { resolveEnvironmentOverride } from 'libs/environment/envOverride/resolveEnvironmentOverride'
import { SwitchableEnvironment } from 'libs/environment/envOverride/types'
import { StorageKey } from 'libs/storage'

export const ENVIRONMENT_OVERRIDE_STORAGE_KEY: StorageKey = 'environment_override'

let activeOverride: SwitchableEnvironment | null = null

export const isEnvironmentSwitchAvailable = (): boolean =>
  env.ENV === 'testing' && env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING

// Must run before first render; reads AsyncStorage directly because persisted store
// hydration resolves too late.
export const applyEnvironmentOverride = async (): Promise<void> => {
  if (!isEnvironmentSwitchAvailable()) return
  try {
    const storedValue = await AsyncStorage.getItem(ENVIRONMENT_OVERRIDE_STORAGE_KEY)
    const result = resolveEnvironmentOverride({
      buildEnvName: env.ENV,
      isCheatcodesBuild: env.FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING,
      storedValue,
    })
    if (result.action === 'purge') {
      await AsyncStorage.removeItem(ENVIRONMENT_OVERRIDE_STORAGE_KEY)
    }
    if (result.action === 'apply') {
      Object.assign(env, ENV_OVERRIDE_CONFIG[result.target])
      activeOverride = result.target
    }
  } catch {
    activeOverride = null
  }
}

export const getEffectiveEnvironment = (): string => activeOverride ?? env.ENV

export const getEnvironmentOverride = (): SwitchableEnvironment | null => activeOverride

export const isEnvironmentOverridden = (): boolean => activeOverride !== null

export const setEnvironmentOverride = async (target: SwitchableEnvironment): Promise<void> => {
  if (target === env.ENV) {
    await clearEnvironmentOverride()
    return
  }
  await AsyncStorage.setItem(ENVIRONMENT_OVERRIDE_STORAGE_KEY, target)
}

export const clearEnvironmentOverride = async (): Promise<void> => {
  await AsyncStorage.removeItem(ENVIRONMENT_OVERRIDE_STORAGE_KEY)
}
