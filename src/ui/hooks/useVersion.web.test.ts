import { renderHook } from '@testing-library/react'
import { vi, expect, it, describe } from 'vitest'

import * as PackageJson from 'libs/packageJson'

import { useVersion } from './useVersion'

const appVersion = '1.10.5'

vi.spyOn(PackageJson, 'getAppVersion').mockReturnValue(appVersion)
vi.mock('react-native-code-push')

describe('useVersion', () => {
  it('should return only the version on web', () => {
    const { result } = renderHook(() => useVersion())

    expect(result.current).toEqual('Version\u00A01.10.5')
  })
})
