import { navigate } from '__mocks__/@react-navigation/native'
import * as API from 'api/api'
import { ApiError } from 'api/ApiError'
import { SubscriptionStep } from 'api/gen'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useIdentificationUrlMutation } from './useIdentificationUrlMutation'

jest.mock('features/identityCheck/queries/useGetStepperInfoQuery', () => ({
  useGetStepperInfoQuery: jest.fn(),
}))
const mockUseGetStepperInfo = useGetStepperInfoQuery as jest.Mock
mockUseGetStepperInfo.mockImplementation(() => ({
  data: { nextSubscriptionStep: SubscriptionStep['email-validation'] },
}))

const postIdentificationSpy = jest
  .spyOn(API.api, 'postNativeV1UbbleIdentification')
  .mockImplementation()

describe('useIdentificationUrlMutation', () => {
  it('should set identificationUrl when API resolves', async () => {
    postIdentificationSpy.mockResolvedValueOnce({ identificationUrl: 'http://ubble.test' })

    const { result } = renderHook(() => useIdentificationUrlMutation(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(result.current).toEqual('http://ubble.test')
    })
  })

  it('should navigate to IdentityCheckPending when IDCHECK_ALREADY_PROCESSED error', async () => {
    postIdentificationSpy.mockRejectedValueOnce(
      new ApiError(400, { code: 'IDCHECK_ALREADY_PROCESSED' })
    )

    renderHook(() => useIdentificationUrlMutation(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
        params: undefined,
        screen: 'IdentityCheckPending',
      })
    })
  })
})
