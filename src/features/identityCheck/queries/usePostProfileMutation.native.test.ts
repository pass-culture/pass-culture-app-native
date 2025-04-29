import * as API from 'api/api'
import { ActivityIdEnum } from 'api/gen'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { usePostProfileMutation } from './usePostProfileMutation'

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

describe('usePostProfileMutation', () => {
  beforeEach(() => {
    mockAuthContextWithUser(beneficiaryUser, { persist: true })
  })

  it('should call api when profile is complete', async () => {
    const { result } = renderHook(
      () => usePostProfileMutation({ onError: jest.fn(), onSuccess: jest.fn() }),
      {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
      }
    )

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
})
