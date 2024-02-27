import * as API from 'api/api'
import { ActivityIdEnum } from 'api/gen'
import * as useSubscriptionContext from 'features/identityCheck/context/SubscriptionContextProvider'
import { eventMonitoring } from 'libs/monitoring'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { usePatchProfile } from './usePatchProfile'

const baseContext = {
  dispatch: jest.fn(),
  profile: {
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
  },
  identification: {
    done: false,
    firstName: 'first',
    lastName: 'last',
    birthDate: null,
    method: null,
  },
  confirmation: {
    accepted: false,
  },
  step: null,
  phoneValidation: null,
}

const subscriptionContextSpy = jest
  .spyOn(useSubscriptionContext, 'useSubscriptionContext')
  .mockReturnValue(baseContext)

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
      await patchProfile()
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

  it('should throw and capture exception when profile is not complete', async () => {
    subscriptionContextSpy.mockReturnValueOnce({
      ...baseContext,
      profile: { ...baseContext.profile, address: null },
    })
    const { result } = renderHook(() => usePatchProfile(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    const { mutateAsync: patchProfile } = result.current

    await act(async () => {
      await expect(patchProfile).rejects.toThrow(
        new Error('No body was provided for subscription profile')
      )
    })

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(
      new Error('No body was provided for subscription profile'),
      {
        extra: {
          profile: {
            hasAddress: false,
            hasCity: true,
            hasFirstName: true,
            hasLastName: true,
            status: ActivityIdEnum.APPRENTICE,
          },
        },
      }
    )
  })
})
