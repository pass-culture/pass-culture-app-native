import url from 'url'

import { getStateFromPath } from '@react-navigation/native'

import { DeeplinkPath, DeeplinkPathWithPathParams } from 'features/deeplinks/enums'
import { ScreenNames } from 'features/navigation/RootNavigator/types'
import { storage } from 'libs/storage'
import { IS_WEB_PROD } from 'libs/web'

type Params = Parameters<typeof getStateFromPath>
type Path = Params[0]
type Config = Params[1]

export function customGetStateFromPath(originalPathWithQueryParams: Path, config: Config) {
  const { search: stringQueryParams } = url.parse(originalPathWithQueryParams, true)

  if (stringQueryParams) parseUtmParameters(stringQueryParams)

  const path = addRedirectSupport(originalPathWithQueryParams)
  const state = getStateFromPath(path, config)
  if (state && state.routes) {
    const screenName = state.routes[0].name as ScreenNames
    // TO DO web : use a unique screen for DeeplinkPath.NEXT_BENEFECIARY_STEP path (and not Login)
    if (screenName === 'NextBeneficiaryStep') {
      const name: ScreenNames = 'Login'
      return {
        ...state,
        routes: [{ key: 'login-1', name, params: { followScreen: 'NextBeneficiaryStep' } }],
      }
    }
  }
  return state
}

function addRedirectSupport(path: Path): Path {
  const { pathname, search } = url.parse(path, true)
  if (!pathname) {
    return path
  }
  if (search && match(pathname, ['offre', 'offer'])) {
    const { id } = getUrlQueryParams(search)
    if (id) {
      return new DeeplinkPathWithPathParams(DeeplinkPath.OFFER, { id }).getFullPath()
    }
  }
  if (IS_WEB_PROD && match(pathname, ['app-components'])) {
    return 'home'
  }
  return path
}

function parseUtmParameters(search: string) {
  const { utm_campaign, utm_medium, utm_source } = getUrlQueryParams(search)

  setImmediate(() => {
    !!utm_campaign && storage.saveString('traffic_campaign', utm_campaign)
    !!utm_medium && storage.saveString('traffic_medium', utm_medium)
    !!utm_source && storage.saveString('traffic_source', utm_source)
  })
}

function match(pathname: string, pathnamesToCheck: string[]): boolean {
  return pathnamesToCheck.some((p) => pathname.includes(p))
}

function getUrlQueryParams(encodedUri: string) {
  const uri = decodeURI(encodedUri)
  const sanitizedUri = uri
    .trim()
    .replace(/^\/+|\/+$/g, '') // removes external '/'
    .replace(/^\?+/g, '') // removes initial '?'
    .replace(/^&+|&+$/g, '') // removes external '&'
  const parameterFields =
    sanitizedUri.split('&').reduce((accumulator, field) => {
      accumulator = accumulator || {}
      const index = field.indexOf('=')
      if (index === -1) {
        accumulator[field] = '' // empty parameter
      } else {
        const key = field.slice(0, index)
        const value = field.slice(index + 1)
        accumulator[key] = value
      }
      return accumulator
    }, <Record<string, string> | null>{}) || {}

  return parameterFields
}
