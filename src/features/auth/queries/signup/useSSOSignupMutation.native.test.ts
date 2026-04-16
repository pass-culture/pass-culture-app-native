import mockdate from 'mockdate'

import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import * as logAdjustRegistrationEventsModule from 'features/auth/pages/signup/helpers/logAdjustRegistrationEvents'
import { useSSOSignupMutation } from 'features/auth/queries/signup/useSSOSignupMutation'
import { getAge } from 'shared/user/getAge'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/pages/signup/helpers/logAdjustRegistrationEvents')

mockdate.set(CURRENT_DATE)

describe('useSSOSignupMutation', () => {
  it('should call logAdjustRegistrationEvents with good user age when google signup is successful', async () => {
    mockServer.postApi('/v1/oauth/google/account', {})
    const birthDate = '2002-12-01T00:00:00.000Z'

    const { result } = renderUseSSOSignupMutation('google')

    result.current.mutate({
      accountCreationToken: 'token',
      birthdate: birthDate,
      token: 'token',
    })

    await waitFor(() => {
      expect(logAdjustRegistrationEventsModule.logAdjustRegistrationEvents).toHaveBeenCalledWith(
        getAge(birthDate)
      )
    })
  })

  it('should call logAdjustRegistrationEvents with good user age when apple signup is successful', async () => {
    mockServer.postApi('/v1/oauth/apple/account', {})
    const birthDate = '2002-12-01T00:00:00.000Z'

    const { result } = renderUseSSOSignupMutation('apple')

    result.current.mutate({
      accountCreationToken: 'token',
      birthdate: birthDate,
      token: 'token',
    })

    await waitFor(() => {
      expect(logAdjustRegistrationEventsModule.logAdjustRegistrationEvents).toHaveBeenCalledWith(
        getAge(birthDate)
      )
    })
  })

  it('should throw when ssoProvider is undefined', async () => {
    const { result } = renderUseSSOSignupMutation(undefined)

    result.current.mutate({
      accountCreationToken: 'token',
      birthdate: '2002-12-01T00:00:00.000Z',
      token: 'token',
    })

    await waitFor(() => {
      expect(result.current.error).toEqual(new Error('ssoProvider is required for SSO signup'))
    })
  })
})

const renderUseSSOSignupMutation = (provider: 'google' | 'apple' | undefined) =>
  renderHook(() => useSSOSignupMutation(provider), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
