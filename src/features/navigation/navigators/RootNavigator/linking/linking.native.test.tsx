import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'

import { linking } from 'features/navigation/navigators/RootNavigator/linking/linking'
import { env } from 'libs/environment/env'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { render } from 'tests/utils'

import { getNestedNavigationFromState } from './getNestedNavigationFromState'

jest.mock('libs/firebase/analytics/analytics')

// We unmock this module to resolve the url with the real @react-navigation linking
jest.unmock('@react-navigation/native')

const getStateFromPathSpy = jest.fn(linking.getStateFromPath)

const openUrl = (url: string) => {
  render(
    <NavigationContainer
      linking={{
        ...linking,
        getInitialURL: () => url,
        subscribe: undefined,
        getStateFromPath: getStateFromPathSpy,
      }}>
      <View />
    </NavigationContainer>
  )

  return {
    path: getStateFromPathSpy.mock.calls[0]?.[0],
    state: getStateFromPathSpy.mock.results[0]?.value,
  }
}

describe('linking', () => {
  beforeEach(() => {
    getStateFromPathSpy.mockClear()
  })

  it('should keep the initial screen when url is the webapp url', () => {
    const { path, state } = openUrl(WEBAPP_V2_URL)

    expect(path).toEqual('')
    expect(state).toBeUndefined()
  })

  it('should open Offer when url is a webapp url', () => {
    const { state } = openUrl(`${WEBAPP_V2_URL}/offre/123`)

    expect(getNestedNavigationFromState(state)).toEqual(['Offer', { id: 123 }])
  })

  it('should open ThematicHome when url uses the passculture custom scheme', () => {
    const { state } = openUrl('passculture://accueil-thematique?homeId=fakeEntryId&from=deeplink')

    expect(getNestedNavigationFromState(state)).toEqual([
      'ThematicHome',
      { homeId: 'fakeEntryId', from: 'deeplink' },
    ])
  })

  it('should keep the initial screen when url is the passculture custom scheme followed by the webapp url', () => {
    const { path, state } = openUrl(`passculture://${WEBAPP_V2_URL}`)

    expect(path).toEqual('')
    expect(state).toBeUndefined()
  })

  it('should open Offer when url is the passculture custom scheme followed by a webapp url', () => {
    const { state } = openUrl(`passculture://${WEBAPP_V2_URL}/offre/123`)

    expect(getNestedNavigationFromState(state)).toEqual(['Offer', { id: 123 }])
  })

  it('should keep the initial screen when url is the passculture custom scheme followed by the webapp url as delivered by iOS', () => {
    const { path, state } = openUrl(`passculture://https//${env.WEBAPP_V2_DOMAIN}`)

    expect(path).toEqual('')
    expect(state).toBeUndefined()
  })

  it('should open Offer when url is the passculture custom scheme followed by a webapp url as delivered by iOS', () => {
    const { state } = openUrl(`passculture://https//${env.WEBAPP_V2_DOMAIN}/offre/123`)

    expect(getNestedNavigationFromState(state)).toEqual(['Offer', { id: 123 }])
  })
})
