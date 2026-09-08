import { api } from 'api/api'
import { getLastLoginInfo } from 'features/auth/helpers/getLastLoginInfo'
import { saveLastLoginInfo } from 'features/auth/helpers/saveLastLoginInfo'
import { Provider } from 'features/auth/types'
import { beneficiaryUserFromAPI } from 'fixtures/user'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'

import { useUserProfileInfoQuery } from './useUserProfileInfoQuery'

jest.mock('features/auth/helpers/getLastLoginInfo')
jest.mock('features/auth/helpers/saveLastLoginInfo')

const getNativeV1MeSpy = jest.spyOn(api, 'getNativeV1Me')

describe('useUserProfileInfoQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    getNativeV1MeSpy.mockResolvedValue(beneficiaryUserFromAPI)
    jest.mocked(getLastLoginInfo).mockResolvedValue({
      maskedEmail: 'em******@domain.ext',
      provider: { type: Provider.EMAIL, label: 'E-mail', icon: EmailFilled },
      lastLoginAt: '2026-09-08T00:00:00.000Z',
    })
  })

  it('should save last login info after every successful /me refetch', async () => {
    const { result } = renderHook(() => useUserProfileInfoQuery(true), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    await act(async () => {
      await result.current.refetch()
    })

    expect(saveLastLoginInfo).toHaveBeenLastCalledWith({
      email: 'email@domain.ext',
      provider: Provider.EMAIL,
    })
  })
})
