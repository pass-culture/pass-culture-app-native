import mockdate from 'mockdate'

import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import * as logAdjustRegistrationEventsModule from 'features/auth/pages/signup/helpers/logAdjustRegistrationEvents'
import { useAppSignupMutation } from 'features/auth/queries/signup/useAppSignupMutation'
import { getAge } from 'shared/user/getAge'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/pages/signup/helpers/logAdjustRegistrationEvents')

mockdate.set(CURRENT_DATE)

describe('useAppSignupMutation', () => {
  it('should call logAdjustRegistrationEvents with good user age when signup is successful', async () => {
    mockServer.postApi('/v1/account', {})
    const birthDate = '2002-12-01T00:00:00.000Z'

    const { result } = renderUseAppSignupMutation()

    result.current.mutate({
      birthdate: birthDate,
      email: 'email@email.com',
      password: 'password',
      token: 'token',
    })

    await waitFor(() => {
      expect(logAdjustRegistrationEventsModule.logAdjustRegistrationEvents).toHaveBeenCalledWith(
        getAge(birthDate)
      )
    })
  })
})

const renderUseAppSignupMutation = () =>
  renderHook(() => useAppSignupMutation(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
