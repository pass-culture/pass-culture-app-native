import { getScreenFromDeeplink } from 'features/deeplinks/helpers'
import { getScreenPath } from 'features/navigation/navigators/RootNavigator/linking/getScreenPath'
import { getSearchHookConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchHookConfig'
import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'

jest.mock('libs/firebase/analytics/analytics')

describe('getScreenFromDeeplink()', () => {
  it('should return PageNotFound when route is unknown', () => {
    const url = getFullUrl('unknown-path')
    const { screen, params } = getScreenFromDeeplink(url)

    expect(screen).toEqual('PageNotFound')
    expect(params).toEqual(undefined)
  })

  it('should return PageNotFound when prefix is not in known config', () => {
    const prefix = 'https://unknown.com'
    const url = getFullUrl(getScreenPath(...homeNavigationConfig), prefix)
    const { screen, params } = getScreenFromDeeplink(url)

    expect(screen).toEqual('PageNotFound')
    expect(params).toEqual(undefined)
  })

  it('should return Home', () => {
    const url = getFullUrl(getScreenPath(...homeNavigationConfig))
    const { screen, params } = getScreenFromDeeplink(url)

    expect(screen).toEqual('TabNavigator')
    expect(params).toEqual({ screen: 'Home', params: undefined })
  })

  it('should also work with a different accepted prefix', () => {
    const url = getFullUrl(getScreenPath(...homeNavigationConfig), '')
    const screenFromDeeplink = getScreenFromDeeplink(url)

    expect(screenFromDeeplink.screen).toEqual('TabNavigator')
    expect(screenFromDeeplink.params).toEqual({ screen: 'Home', params: undefined })
  })

  it('should return ProfileStackNavigator when url = /profil', () => {
    const url = getFullUrl(getScreenPath(...getTabHookConfig('Profile')))
    const { screen, params } = getScreenFromDeeplink(url)

    expect(screen).toEqual('TabNavigator')
    expect(params).toEqual({ screen: 'Profile', params: undefined })
  })

  it('should return SearchStackNavigator when url = /recherche/resultats', () => {
    const url = getFullUrl(getScreenPath(...getSearchHookConfig('SearchResults')))
    const { screen, params } = getScreenFromDeeplink(url)

    expect(screen).toEqual('TabNavigator')
    expect(params).toEqual({ screen: 'SearchStackNavigator', params: undefined })
  })

  it('should return SearchStackNavigator when url = /recherche/accueil', () => {
    const url = getFullUrl(getScreenPath(...getSearchHookConfig('SearchLanding')))
    const { screen, params } = getScreenFromDeeplink(url)

    expect(screen).toEqual('TabNavigator')
    expect(params).toEqual({ screen: 'SearchStackNavigator', params: undefined })
  })

  it('should return SearchFilter when url = /recherche/filter', () => {
    const url = getFullUrl(getScreenPath('SearchFilter', undefined))
    const { screen, params } = getScreenFromDeeplink(url)

    expect(screen).toEqual('SearchFilter')
    expect(params).toEqual(undefined)
  })

  it('should return SearchStackNavigator when url = /recherche/thematic', () => {
    const url = getFullUrl(getScreenPath(...getSearchHookConfig('ThematicSearch')))
    const { screen, params } = getScreenFromDeeplink(url)

    expect(screen).toEqual('TabNavigator')
    expect(params).toEqual({ screen: 'SearchStackNavigator', params: undefined })
  })

  it('should return Offer with id=666', () => {
    const url = getScreenPath('Offer', { id: 666, from: 'offer', moduleName: undefined })

    const { screen, params } = getScreenFromDeeplink(url)

    expect(screen).toEqual('Offer')
    expect(params).toEqual({ id: 666, from: 'offer' })
  })
})

function getFullUrl(path: string, webappUrl = WEBAPP_V2_URL) {
  return webappUrl + path
}
