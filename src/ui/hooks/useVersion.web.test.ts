import * as PackageJson from 'libs/packageJson'
import { renderHook } from 'tests/utils/web'

import { useVersion } from './useVersion'

const appVersion = '1.10.5'
jest.spyOn(PackageJson, 'getAppVersion').mockReturnValue(appVersion)

describe('useVersion', () => {
  it('should return only the version on web', () => {
    const { result } = renderHook(() => useVersion())

    expect(result.current).toEqual('Version\u00A01.10.5')
  })
})
