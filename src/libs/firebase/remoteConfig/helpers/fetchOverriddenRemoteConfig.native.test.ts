import { ENV_OVERRIDE_FIREBASE_CONFIG } from 'libs/environment/envOverride/envOverrideConfig'
import {
  fetchOverriddenRemoteConfig,
  REMOTE_CONFIG_FETCH_BASE_URL,
} from 'libs/firebase/remoteConfig/helpers/fetchOverriddenRemoteConfig'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { mockServer } from 'tests/mswServer'

const fetchUrl = `${REMOTE_CONFIG_FETCH_BASE_URL}/projects/${ENV_OVERRIDE_FIREBASE_CONFIG.production.FIREBASE_PROJECTID}/namespaces/firebase:fetch`

describe('fetchOverriddenRemoteConfig', () => {
  it('should return the values fetched from the target project', async () => {
    mockServer.universalPost(fetchUrl, {
      entries: { homeEntryIdBeneficiary: 'prodEntryId', shouldLogInfo: 'true' },
    })

    const result = await fetchOverriddenRemoteConfig('production')

    expect(result.homeEntryIdBeneficiary).toEqual('prodEntryId')
    expect(result.shouldLogInfo).toEqual(true)
  })

  it('should parse JSON parameters fetched from the target project', async () => {
    mockServer.universalPost(fetchUrl, {
      entries: { aroundPrecision: '[{"from":0,"value":10}]' },
    })

    const result = await fetchOverriddenRemoteConfig('production')

    expect(result.aroundPrecision).toEqual([{ from: 0, value: 10 }])
  })

  it('should fall back to default values for keys missing from the target project', async () => {
    mockServer.universalPost(fetchUrl, { entries: { homeEntryIdBeneficiary: 'prodEntryId' } })

    const result = await fetchOverriddenRemoteConfig('production')

    expect(result.subscriptionHomeEntryIds).toEqual(DEFAULT_REMOTE_CONFIG.subscriptionHomeEntryIds)
    expect(result.shareAppModalVersion).toEqual(DEFAULT_REMOTE_CONFIG.shareAppModalVersion)
  })

  it('should throw when the target project request fails', async () => {
    mockServer.universalPost(fetchUrl, { responseOptions: { statusCode: 500, data: {} } })

    await expect(fetchOverriddenRemoteConfig('production')).rejects.toThrow(
      'Failed to fetch remote config for "production", code: 500'
    )
  })
})
