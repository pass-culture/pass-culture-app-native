import { Platform } from 'react-native'

import { env } from 'libs/environment'

import { formatDeeplinkDomain } from './utils'

describe('Formatting deeplink url', () => {
  afterAll(() => jest.resetAllMocks())

  it('should format properly the deeplink domain for iOS', () => {
    Platform.OS = 'ios'
    const deeplinkUrl = formatDeeplinkDomain()
    expect(deeplinkUrl).toEqual(`${env.URL_PREFIX}://${env.IOS_APP_ID}/`)
  })
  it('should format properly the deeplink domain for Android', () => {
    Platform.OS = 'android'
    const deeplinkUrl = formatDeeplinkDomain()
    expect(deeplinkUrl).toEqual(`${env.URL_PREFIX}://${env.ANDROID_APP_ID}/`)
  })
})
