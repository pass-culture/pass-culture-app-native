import { HotUpdater } from '@hot-updater/react-native'

import { eventMonitoring } from 'libs/monitoring/services'
import * as PackageJson from 'libs/packageJson'
import { act, renderHook, waitFor } from 'tests/utils'

import { useVersion } from './useVersion'

const appVersion = '1.360.2'
jest.spyOn(PackageJson, 'getAppVersion').mockReturnValue(appVersion)

jest.mock('@hot-updater/react-native', () => ({
  HotUpdater: {
    getBundleId: jest.fn(() => '0199a453-9467-7933-b6d7-6b1020cb5b25'),
  },
}))

describe('useVersion', () => {
  it('should return only the version when there are no HotUpdater information', async () => {
    ;(HotUpdater.getBundleId as jest.Mock).mockReturnValueOnce(undefined)
    const { result } = renderHook(() => useVersion())

    await act(async () => {})

    expect(result.current).toEqual('Version\u00A0' + appVersion)
  })

  it('should return version and HotUpdater label when there are HotUpdater information', async () => {
    ;(HotUpdater.getBundleId as jest.Mock).mockReturnValueOnce(
      '0199a453-9467-7933-b6d7-6b1020cb5b25'
    )
    const { result } = renderHook(useVersion)

    await act(async () => {})

    expect(result.current).toEqual('Version\u00A0' + appVersion + '-5b25')
  })

  it('should capture a Sentry issue when there is an error', async () => {
    const error = new Error('HotUpdater failure')
    ;(HotUpdater.getBundleId as jest.Mock).mockImplementationOnce(() => {
      throw error
    })
    renderHook(() => useVersion())

    await waitFor(() => {
      expect(eventMonitoring.captureException).toHaveBeenCalledWith(error)
    })
  })
})
