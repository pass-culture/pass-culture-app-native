import { Platform } from 'react-native'

import { getPlatformLabel } from 'libs/analytics/getPlatformLabel'

describe('getPlatformLabel', () => {
  const originalPlatform = Platform.OS

  afterEach(() => {
    Platform.OS = originalPlatform
  })

  it('should returns iOS for ios', () => {
    Platform.OS = 'ios'

    expect(getPlatformLabel()).toBe('iOS')
  })

  it('should returns Android for android', () => {
    Platform.OS = 'android'

    expect(getPlatformLabel()).toBe('Android')
  })

  it('should returns Web for web', () => {
    Platform.OS = 'web'

    expect(getPlatformLabel()).toBe('Web')
  })
})
