import * as API from 'api/api'
import { ActivityIdEnum } from 'api/gen'
import { storage } from 'libs/storage'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

import { usePatchProfile } from './usePatchProfile'

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

describe('usePatchProfile', () => {
  it('should call api when profile is complete', async () => {
    const { result } = renderHook(() => usePatchProfile(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const { mutateAsync: patchProfile } = result.current

    await act(async () => {
      await patchProfile(profile)
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

    const { result } = renderHook(() => usePatchProfile(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const { mutateAsync: patchProfile } = result.current

    await act(async () => {
      await patchProfile(profile)
    })

    await waitFor(async () => {
      expect(await storage.readObject('profile-name')).toMatchObject({ state: { name: null } })
      expect(await storage.readObject('profile-city')).toMatchObject({ state: { city: null } })
      expect(await storage.readObject('profile-address')).toMatchObject({
        state: { address: null },
      })
    })
  })
})
