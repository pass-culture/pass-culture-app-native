import { SubscriptionStepperResponseV3 } from 'api/gen'
import {
  SubscriptionStepperErrorResponseFixture,
  SubscriptionStepperResponseFixture,
} from 'features/identityCheck/pages/helpers/stepperInfo.fixture'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext')

mockAuthContextWithUser({
  ...beneficiaryUser,
})

describe('useGetStepperInfo', () => {
  beforeEach(() => {
    setFeatureFlags([])
  })

  it('should get stepsToDisplay from the back', async () => {
    mockServer.getApi<SubscriptionStepperResponseV3>(
      '/v3/subscription/stepper',
      SubscriptionStepperResponseFixture
    )
    const { result } = renderGetStepperInfo()
    await waitFor(() => expect(result.current.isSuccess).toEqual(true))

    expect(result.current.data).toEqual({
      ...SubscriptionStepperResponseFixture,
      title: 'Titre Stepper',
      subtitle: 'Sous titre Stepper',
    })
  })

  it('should return an errorMessage', async () => {
    mockServer.getApi<SubscriptionStepperResponseV3>(
      '/v3/subscription/stepper',
      SubscriptionStepperErrorResponseFixture
    )

    const { result } = renderGetStepperInfo()
    await waitFor(() => expect(result.current.isSuccess).toEqual(true))

    expect(result.current.data?.subscriptionMessage?.messageSummary).toEqual(
      'Tu n’as pas fournis les bons documents'
    )
  })

  it('should only fetch data when user is logged in', async () => {
    mockAuthContextWithoutUser()
    const { result } = renderGetStepperInfo()

    await waitFor(() => expect(result.current.isFetched).toEqual(false))
    await waitFor(() => expect(result.current.isEnabled).toEqual(false))
  })
})

const renderGetStepperInfo = () =>
  renderHook(() => useGetStepperInfoQuery(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
