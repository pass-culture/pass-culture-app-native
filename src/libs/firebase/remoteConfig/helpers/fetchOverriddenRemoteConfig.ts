import { ENV_OVERRIDE_FIREBASE_CONFIG } from 'libs/environment/envOverride/envOverrideConfig'
import { SwitchableEnvironment } from 'libs/environment/envOverride/types'
import { getRemoteConfigFromConfigValues } from 'libs/firebase/remoteConfig/helpers/getRemoteConfigFromConfigValues'
import { transformDefaultValues } from 'libs/firebase/remoteConfig/helpers/transformDefaultValues'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { CustomRemoteConfig } from 'libs/firebase/remoteConfig/remoteConfig.types'
import { FirebaseRemoteConfigTypes } from 'libs/firebase/shims/remote-config'

export const REMOTE_CONFIG_FETCH_BASE_URL = 'https://firebaseremoteconfig.googleapis.com/v1'

const APP_INSTANCE_ID = 'env-override'

const TRUTHY_CONFIG_VALUES = new Set(['1', 'true', 't', 'yes', 'y', 'on'])

type RemoteConfigFetchResponse = {
  entries?: Record<string, string>
}

const toConfigValue = (value: string): FirebaseRemoteConfigTypes.ConfigValue => ({
  asString: () => value,
  asBoolean: () => TRUTHY_CONFIG_VALUES.has(value.toLowerCase()),
  asNumber: () => Number(value) || 0,
  getSource: () => 'remote',
})

// REST fetch because the remote config SDK only supports the build's default Firebase app.
export const fetchOverriddenRemoteConfig = async (
  target: SwitchableEnvironment
): Promise<CustomRemoteConfig> => {
  const { FIREBASE_PROJECTID, FIREBASE_API_PUBLIC_KEY, FIREBASE_APPID } =
    ENV_OVERRIDE_FIREBASE_CONFIG[target]
  const url = `${REMOTE_CONFIG_FETCH_BASE_URL}/projects/${FIREBASE_PROJECTID}/namespaces/firebase:fetch?key=${FIREBASE_API_PUBLIC_KEY}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ appId: FIREBASE_APPID, appInstanceId: APP_INSTANCE_ID }),
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch remote config for "${target}", code: ${response.status}`)
  }

  const { entries = {} } = (await response.json()) as RemoteConfigFetchResponse

  const defaultEntries = Object.fromEntries(
    Object.entries(transformDefaultValues(DEFAULT_REMOTE_CONFIG)).map(([key, value]) => [
      key,
      String(value),
    ])
  )
  const configValues = Object.fromEntries(
    Object.entries({ ...defaultEntries, ...entries }).map(([key, value]) => [
      key,
      toConfigValue(value),
    ])
  )
  return getRemoteConfigFromConfigValues(configValues)
}
