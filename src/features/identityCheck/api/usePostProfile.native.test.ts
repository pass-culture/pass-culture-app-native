import * as API from 'api/api'
import { ActivityIdEnum } from 'api/gen'
import { beneficiaryUser } from 'fixtures/user'
import { storage } from 'libs/storage'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

import { usePostProfile } from './usePostProfile'

jest.mock('features/auth/context/AuthContext')

const profile = {
  address: 'address',
  city: {
    name: 'city',
    code: '75000',
    postalCode: '75000',
  },
  name: {
    firstName: 'first name',
    lastName: 'last name',
  },
  status: ActivityIdEnum.APPRENTICE,
  hasSchoolTypes: false,
  schoolType: null,
}

const postSubscriptionProfileSpy = jest
  .spyOn(API.api, 'postNativeV1SubscriptionProfile')
  .mockImplementation()

describe('usePostProfile', () => {
  beforeEach(() => {
    mockAuthContextWithUser(beneficiaryUser, { persist: true })
  })

  it('should call api when profile is complete', async () => {
    const { result } = renderHook(() => usePostProfile(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const { mutateAsync: postProfile } = result.current

    await act(async () => {
      await postProfile(profile)
    })

    expect(postSubscriptionProfileSpy).toHaveBeenCalledWith({
      address: 'address',
      city: 'city',
      postalCode: '75000',
      firstName: 'first name',
      lastName: 'last name',
      activityId: ActivityIdEnum.APPRENTICE,
      schoolTypeId: null,
    })
  })

  it('should clear activation profile from storage when query succeeds', async () => {
    storage.saveObject('profile-name', profile.name)
    storage.saveObject('profile-city', profile.city)
    storage.saveObject('profile-address', profile.address)

    const { result } = renderHook(() => usePostProfile(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const { mutateAsync: postProfile } = result.current

    await act(async () => {
      await postProfile(profile)
    })

    await waitFor(async () => {
      expect(await storage.readObject('profile-name')).toMatchObject({ state: { name: null } })
      expect(await storage.readObject('profile-city')).toMatchObject({ state: { city: null } })
      expect(await storage.readObject('profile-address')).toMatchObject({
        state: { address: null },
      })
    })
  })

  it('should call refetchUser when query succeeds', async () => {
    const refetchUserSpy = jest.fn()
    mockAuthContextWithUser(beneficiaryUser, { refetchUser: refetchUserSpy })

    const { result } = renderHook(() => usePostProfile(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const { mutateAsync: postProfile } = result.current

    await act(async () => {
      await postProfile(profile)
    })

    expect(refetchUserSpy).toHaveBeenCalledWith()
  })
})
