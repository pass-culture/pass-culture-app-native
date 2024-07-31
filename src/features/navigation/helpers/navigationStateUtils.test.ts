import { NavigationState } from '@react-navigation/native'

import { resetNavigationStateUponFeatureFlags } from 'features/navigation/helpers/navigationStateUtils'
import { FeatureFlagDocument } from 'libs/firebase/firestore/featureFlags/types'

describe('navigationStateUtils', () => {
  const initialState: NavigationState = {
    index: 1,
    key: 'key',
    routeNames: ['foo', 'bar', 'biz'],
    routes: [
      {
        key: '1',
        name: 'Home',
      },
      {
        key: '2',
        name: 'Artist',
      },
    ],
    type: 'stack',
    stale: false,
  }

  it('should return same state object if no feature flag definition is given', async () => {
    const state = await resetNavigationStateUponFeatureFlags(initialState, undefined)

    expect(state).toBe(initialState)
  })

  it('should return same state object if state has no routes', async () => {
    const mutatedState = { ...initialState, routes: [] }
    const state = await resetNavigationStateUponFeatureFlags(mutatedState)

    expect(state).toBe(mutatedState)
  })

  it('should return same state object if feature flag is found and enabled', async () => {
    const mockFeatureFlagDocument = {
      get: () => ({
        minimalBuildNumber: 0,
      }),
    } as unknown as FeatureFlagDocument

    const state = await resetNavigationStateUponFeatureFlags(initialState, mockFeatureFlagDocument)

    expect(state).toBe(initialState)
  })

  it('should return new state object if feature flag is found and disabled', async () => {
    const mockFeatureFlagDocument = {
      get: () => ({
        minimalBuildNumber: Number.POSITIVE_INFINITY,
      }),
    } as unknown as FeatureFlagDocument

    const state = await resetNavigationStateUponFeatureFlags(initialState, mockFeatureFlagDocument)

    expect(state).toMatchObject({
      ...initialState,
      index: 0,
      routes: initialState.routes.slice(0, initialState.routes.length - 1),
    })
  })

  it('should return state object with home page by default when new state results as empty and feature flag is found and disabled', async () => {
    const mutatedState = {
      ...initialState,
      routes: initialState.routes.slice(-1),
      index: 0,
    }
    const mockFeatureFlagDocument = {
      get: () => ({
        minimalBuildNumber: Number.POSITIVE_INFINITY,
      }),
    } as unknown as FeatureFlagDocument

    const state = await resetNavigationStateUponFeatureFlags(mutatedState, mockFeatureFlagDocument)

    expect(state).toMatchObject({
      ...initialState,
      index: 0,
      routes: [{ key: 'TabNavigator', name: 'TabNavigator' }],
    })
  })
})
