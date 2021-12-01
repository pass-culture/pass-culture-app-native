import { renderHook } from '@testing-library/react-hooks'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { SettingsResponse } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'

import { useNavigateToIdCheck } from './useNavigateToIdCheck'

const mockedUseAppSettings = mocked(useAppSettings, true)
jest.mock('features/auth/settings')

describe('useNavigateToIdCheck()', () => {
  it('should navigate to home when allowIdCheckRegistration=false', () => {
    const navigateToIdCheck = mockNavigateToIdCheck(false)
    navigateToIdCheck()
    expect(navigate).toHaveBeenNthCalledWith(1, 'IdCheckUnavailable')
  })

  it('should navigate to IdCheck v2 when allowIdCheckRegistration=true', () => {
    const navigateToIdCheck = mockNavigateToIdCheck(true)
    navigateToIdCheck()
    expect(navigate).toHaveBeenNthCalledWith(1, 'IdCheckV2')
  })
})

function mockNavigateToIdCheck(allowIdCheckRegistration: boolean) {
  mockedUseAppSettings.mockReturnValue({
    data: { allowIdCheckRegistration },
  } as UseQueryResult<SettingsResponse>)

  const { result } = renderHook(useNavigateToIdCheck)
  return result.current
}
