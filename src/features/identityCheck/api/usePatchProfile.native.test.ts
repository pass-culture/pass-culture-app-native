import * as API from 'api/api'
import { ActivityIdEnum } from 'api/gen'
import {
  useAddress,
  useAddressActions,
} from 'features/identityCheck/pages/profile/store/addressStore'
import { useCity, useCityActions } from 'features/identityCheck/pages/profile/store/cityStore'
import { useName, useNameActions } from 'features/identityCheck/pages/profile/store/nameStore'
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

const mockResetName = jest.fn()
jest.mock('features/identityCheck/pages/profile/store/nameStore')
;(useName as jest.Mock).mockReturnValue(profile.name)
;(useNameActions as jest.Mock).mockReturnValue({ resetName: mockResetName })

const mockResetCity = jest.fn()
jest.mock('features/identityCheck/pages/profile/store/cityStore')
;(useCity as jest.Mock).mockReturnValue(profile.city)
;(useCityActions as jest.Mock).mockReturnValue({ resetCity: mockResetCity })

const mockResetAddress = jest.fn()
jest.mock('features/identityCheck/pages/profile/store/addressStore')
;(useAddress as jest.Mock).mockReturnValue(profile.address)
;(useAddressActions as jest.Mock).mockReturnValue({ resetAddress: mockResetAddress })

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
    const { result } = renderHook(() => usePatchProfile(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const { mutateAsync: patchProfile } = result.current

    await act(async () => {
      await patchProfile(profile)
    })

    await waitFor(async () => {
      expect(mockResetName).toHaveBeenCalledTimes(1)
      expect(mockResetCity).toHaveBeenCalledTimes(1)
      expect(mockResetAddress).toHaveBeenCalledTimes(1)
    })
  })
})
