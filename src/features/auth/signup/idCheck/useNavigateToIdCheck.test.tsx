import { renderHook } from '@testing-library/react-hooks'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { SettingsResponse } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { navigateToHome } from 'features/navigation/helpers'

import { useNavigateToIdCheck } from './useNavigateToIdCheck'

jest.mock('features/navigation/helpers')
const mockedUseAppSettings = mocked(useAppSettings, true)
jest.mock('features/auth/settings')

describe('useNavigateToIdCheck()', () => {
  it('should navigate to IdCheck v2 when shouldControlNavWithSetting=false, allowIdCheckRegistration=false', () => {
    const navigateToIdCheck = mockNavigateToIdCheck({
      allowIdCheckRegistration: false,
      shouldControlNavWithSetting: false,
      onIdCheckNavigationBlocked: undefined,
    })

    navigateToIdCheck()

    expect(navigate).toBeCalledWith('IdCheckV2')
  })

  it('should navigate to home when shouldControlNavWithSetting=true, allowIdCheckRegistration=false', () => {
    const navigateToIdCheck = mockNavigateToIdCheck({
      allowIdCheckRegistration: false,
      shouldControlNavWithSetting: true,
      onIdCheckNavigationBlocked: undefined,
    })

    navigateToIdCheck()

    waitForExpect(() => {
      expect(navigateToHome).toBeCalled()
    })
  })

  it('should call onIdCheckNavigationBlocked() when onIdCheckNavigationBlocked is defined and shouldControlNavWithSetting=true, allowIdCheckRegistration=false', () => {
    const onIdCheckNavigationBlocked = jest.fn()
    const navigateToIdCheck = mockNavigateToIdCheck({
      allowIdCheckRegistration: false,
      shouldControlNavWithSetting: true,
      onIdCheckNavigationBlocked,
    })

    navigateToIdCheck()

    expect(onIdCheckNavigationBlocked).toBeCalled()
    expect(navigateToHome).not.toBeCalled()
  })

  it('should navigate to IdCheck v2 when shouldControlNavWithSetting=true, allowIdCheckRegistration=true', () => {
    const navigateToIdCheck = mockNavigateToIdCheck({
      allowIdCheckRegistration: true,
      shouldControlNavWithSetting: true,
      onIdCheckNavigationBlocked: undefined,
    })

    navigateToIdCheck()

    expect(navigate).toBeCalledWith('IdCheckV2')
  })
})

function mockNavigateToIdCheck({
  allowIdCheckRegistration,
  shouldControlNavWithSetting,
  onIdCheckNavigationBlocked,
}: {
  allowIdCheckRegistration: boolean
  shouldControlNavWithSetting: boolean
  onIdCheckNavigationBlocked?: () => void
}) {
  mockedUseAppSettings.mockReturnValue({
    data: { allowIdCheckRegistration },
  } as UseQueryResult<SettingsResponse>)
  const {
    result: { current: navigateToIdCheck },
  } = renderHook(() =>
    useNavigateToIdCheck({ shouldControlNavWithSetting, onIdCheckNavigationBlocked })
  )
  return navigateToIdCheck
}
