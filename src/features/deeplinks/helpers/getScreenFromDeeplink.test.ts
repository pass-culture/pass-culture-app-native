import { getScreenFromDeeplink } from 'features/deeplinks/helpers'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { WEBAPP_V2_URL } from 'libs/environment'

// To see the linking config used in the tests, check the file :
// features/navigation/RootNavigator/__mocks__/routes.ts

describe('getScreenFromDeeplink()', () => {
  it('should return PageNotFound when route is unknown', () => {
    const url = getFullUrl('unknown-path')
    const { screen, params } = getScreenFromDeeplink(url)
    expect(screen).toEqual('PageNotFound')
    expect(params).toEqual(undefined)
  })

  it('should return PageNotFound when prefix is not in known config', () => {
    const prefix = 'https://unknown.com'
    const url = getFullUrl(getScreenPath(...homeNavConfig), prefix)
    const { screen, params } = getScreenFromDeeplink(url)
    expect(screen).toEqual('PageNotFound')
    expect(params).toEqual(undefined)
  })

  it('should return Home', () => {
    const url = getFullUrl(getScreenPath(...homeNavConfig))
    const { screen, params } = getScreenFromDeeplink(url)
    expect(screen).toEqual('TabNavigator')
    expect(params).toEqual({ screen: 'Home', params: undefined })
  })

  it('should also work with a different accepted prefix', () => {
    const url = getFullUrl(getScreenPath(...homeNavConfig), '')
    const screenFromDeeplink = getScreenFromDeeplink(url)
    expect(screenFromDeeplink.screen).toEqual('TabNavigator')
    expect(screenFromDeeplink.params).toEqual({ screen: 'Home', params: undefined })
  })

  it('should return Home with entryId=666', () => {
    const url = getFullUrl(getScreenPath(...homeNavConfig) + '?entryId=666')
    const { screen, params } = getScreenFromDeeplink(url)
    expect(screen).toEqual('TabNavigator')
    expect(params).toEqual({ screen: 'Home', params: { entryId: '666' } })
  })

  it('should return Profil when url = /profil', () => {
    const url = getFullUrl(getScreenPath(...getTabNavConfig('Profile', undefined)))
    const { screen, params } = getScreenFromDeeplink(url)
    expect(screen).toEqual('TabNavigator')
    expect(params).toEqual({ screen: 'Profile', params: undefined })
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
