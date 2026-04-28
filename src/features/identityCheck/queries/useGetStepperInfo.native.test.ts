import { SubscriptionStepperResponseV2, SubscriptionStepperResponseV3 } from 'api/gen'
import {
  SubscriptionStepperErrorResponseFixture,
  SubscriptionStepperResponseFixture,
  SubscriptionStepperResponseV3Fixture,
} from 'features/identityCheck/pages/helpers/stepperInfo.fixture'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('useGetStepperInfo', () => {
  beforeEach(() => {
    setFeatureFlags([])
  })

  it('should get stepsToDisplay from the back', async () => {
    mockServer.getApi<SubscriptionStepperResponseV2>(
      '/v2/subscription/stepper',
      SubscriptionStepperResponseFixture
    )
    const { result } = renderGetStepperInfo()
    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(result.current.data).toEqual({
      ...SubscriptionStepperResponseFixture,
      title: 'Titre Stepper',
      subtitle: 'Sous titre Stepper',
    })
  })

  it('should return an errorMessage', async () => {
    mockServer.getApi<SubscriptionStepperResponseV2>(
      '/v2/subscription/stepper',
      SubscriptionStepperErrorResponseFixture
    )

    const { result } = renderGetStepperInfo()
    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(result.current.data?.subscriptionMessage?.messageSummary).toEqual(
      'Tu n’as pas fournis les bons documents'
    )
  })

  it('should call V2 API endpoint when feature flag is disabled', async () => {
    mockServer.getApi<SubscriptionStepperResponseV2>(
      '/v2/subscription/stepper',
      SubscriptionStepperResponseFixture
    )

    const { result } = renderGetStepperInfo()
    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.title).toEqual('Titre Stepper')
  })

  it('should call V3 API endpoint when feature flag  WIP_PHONE_NUMBER_IN_PROFILE_STEPPERis enabled', async () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_PHONE_NUMBER_IN_PROFILE_STEPPER])
    mockServer.getApi<SubscriptionStepperResponseV3>(
      '/v3/subscription/stepper',
      SubscriptionStepperResponseV3Fixture
    )

    const { result } = renderGetStepperInfo()
    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.title).toEqual('Titre Stepper')
  })
})

const renderGetStepperInfo = () =>
  renderHook(() => useGetStepperInfoQuery(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
