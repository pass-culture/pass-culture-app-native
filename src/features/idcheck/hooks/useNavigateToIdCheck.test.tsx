import { renderHook } from '@testing-library/react-hooks'
import { UseQueryResult } from 'react-query'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { SettingsResponse } from 'api/gen'
import { useAppSettings } from 'features/auth/settings'
import { navigateToHome } from 'features/navigation/helpers'

import { useNavigateToIdCheck } from './useNavigateToIdCheck'

jest.mock('features/navigation/helpers')
const mockedUseAppSettings = mocked(useAppSettings, true)
jest.mock('features/auth/settings')

beforeEach(() => {
  jest.clearAllMocks()
})

const EMAIL = 'EMAIL'
const LICENCE_TOKEN = 'LICENCE_TOKEN'
const LICENCE_TOKEN_EXPIRATION_TIMESTAMP = new Date('2021-05-26T21:48:17.871Z').getTime()

describe('useNavigateToIdCheck()', () => {
  it('should navigate to IdCheck v1 when shouldControlNavWithSetting=false, enableNativeIdCheckVersion=false, allowIdCheckRegistration=false', () => {
    const navigateToIdCheck = mockNavigateToIdCheck({
      enableNativeIdCheckVersion: false,
      allowIdCheckRegistration: false,
      shouldControlNavWithSetting: false,
      onIdCheckNavigationBlocked: undefined,
    })

    navigateToIdCheck(EMAIL, LICENCE_TOKEN, LICENCE_TOKEN_EXPIRATION_TIMESTAMP)

    expect(navigate).toBeCalledWith('IdCheck', {
      email: EMAIL,
      licence_token: LICENCE_TOKEN,
      expiration_timestamp: LICENCE_TOKEN_EXPIRATION_TIMESTAMP,
    })
  })

  it('should navigate to IdCheck v2 when shouldControlNavWithSetting=false, enableNativeIdCheckVersion=true, allowIdCheckRegistration=false', () => {
    const navigateToIdCheck = mockNavigateToIdCheck({
      enableNativeIdCheckVersion: true,
      allowIdCheckRegistration: false,
      shouldControlNavWithSetting: false,
      onIdCheckNavigationBlocked: undefined,
    })

    navigateToIdCheck(EMAIL, LICENCE_TOKEN, LICENCE_TOKEN_EXPIRATION_TIMESTAMP)

    expect(navigate).toBeCalledWith('IdCheckV2', {
      email: EMAIL,
      licence_token: LICENCE_TOKEN,
      expiration_timestamp: LICENCE_TOKEN_EXPIRATION_TIMESTAMP,
    })
  })

  it('should navigate to home when shouldControlNavWithSetting=true, enableNativeIdCheckVersion=false, allowIdCheckRegistration=false', () => {
    const navigateToIdCheck = mockNavigateToIdCheck({
      enableNativeIdCheckVersion: false,
      allowIdCheckRegistration: false,
      shouldControlNavWithSetting: true,
      onIdCheckNavigationBlocked: undefined,
    })

    navigateToIdCheck(EMAIL, LICENCE_TOKEN, LICENCE_TOKEN_EXPIRATION_TIMESTAMP)

    expect(navigateToHome).toBeCalled()
  })

  it('should call onIdCheckNavigationBlocked() when onIdCheckNavigationBlocked is defined and shouldControlNavWithSetting=true, enableNativeIdCheckVersion=false, allowIdCheckRegistration=false', () => {
    const onIdCheckNavigationBlocked = jest.fn()
    const navigateToIdCheck = mockNavigateToIdCheck({
      enableNativeIdCheckVersion: true,
      allowIdCheckRegistration: false,
      shouldControlNavWithSetting: true,
      onIdCheckNavigationBlocked,
    })

    navigateToIdCheck(EMAIL, LICENCE_TOKEN, LICENCE_TOKEN_EXPIRATION_TIMESTAMP)

    expect(onIdCheckNavigationBlocked).toBeCalled()
    expect(navigateToHome).not.toBeCalled()
  })

  it('should navigate to IdCheck v1 when shouldControlNavWithSetting=true, enableNativeIdCheckVersion=false, allowIdCheckRegistration=true', () => {
    const navigateToIdCheck = mockNavigateToIdCheck({
      enableNativeIdCheckVersion: false,
      allowIdCheckRegistration: true,
      shouldControlNavWithSetting: true,
      onIdCheckNavigationBlocked: undefined,
    })

    navigateToIdCheck(EMAIL, LICENCE_TOKEN, LICENCE_TOKEN_EXPIRATION_TIMESTAMP)

    expect(navigate).toBeCalledWith('IdCheck', {
      email: EMAIL,
      licence_token: LICENCE_TOKEN,
      expiration_timestamp: LICENCE_TOKEN_EXPIRATION_TIMESTAMP,
    })
  })

  it('should navigate to IdCheck v2 when shouldControlNavWithSetting=true, enableNativeIdCheckVersion=true, allowIdCheckRegistration=true', () => {
    const navigateToIdCheck = mockNavigateToIdCheck({
      enableNativeIdCheckVersion: true,
      allowIdCheckRegistration: true,
      shouldControlNavWithSetting: true,
      onIdCheckNavigationBlocked: undefined,
    })

    navigateToIdCheck(EMAIL, LICENCE_TOKEN, LICENCE_TOKEN_EXPIRATION_TIMESTAMP)

    expect(navigate).toBeCalledWith('IdCheckV2', {
      email: EMAIL,
      licence_token: LICENCE_TOKEN,
      expiration_timestamp: LICENCE_TOKEN_EXPIRATION_TIMESTAMP,
    })
  })
})

function mockNavigateToIdCheck({
  enableNativeIdCheckVersion,
  allowIdCheckRegistration,
  shouldControlNavWithSetting,
  onIdCheckNavigationBlocked,
}: {
  enableNativeIdCheckVersion: boolean
  allowIdCheckRegistration: boolean
  shouldControlNavWithSetting: boolean
  onIdCheckNavigationBlocked?: () => void
}) {
  mockedUseAppSettings.mockReturnValue({
    data: { enableNativeIdCheckVersion, allowIdCheckRegistration },
  } as UseQueryResult<SettingsResponse>)
  const {
    result: { current: navigateToIdCheck },
  } = renderHook(() =>
    useNavigateToIdCheck({ shouldControlNavWithSetting, onIdCheckNavigationBlocked })
  )
  return navigateToIdCheck
}
