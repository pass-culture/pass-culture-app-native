import { SubscriptionStepperResponse } from 'api/gen'
import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import {
  SubscriptionStepperErrorResponseFixture,
  SubscriptionStepperResponseFixture,
} from 'features/identityCheck/pages/helpers/stepperInfo.fixture'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

describe('useGetStepperInfo', () => {
  it('should get stepsToDisplay from the back', async () => {
    mockServer.getApi<SubscriptionStepperResponse>(
      '/v2/subscription/stepper',
      SubscriptionStepperResponseFixture
    )
    const result = renderGetStepperInfo()
    await act(async () => {})

    expect(result.result.current.data).toEqual({
      ...SubscriptionStepperResponseFixture,
      title: 'Titre Stepper',
      subtitle: 'Sous titre Stepper',
    })
  })

  it('should return an errorMessage', async () => {
    mockServer.getApi<SubscriptionStepperResponse>(
      '/v2/subscription/stepper',
      SubscriptionStepperErrorResponseFixture
    )

    const result = renderGetStepperInfo()
    await act(async () => {})

    expect(result.result.current.data).toEqual({
      ...SubscriptionStepperResponseFixture,
      title: 'Titre Stepper',
      subtitle: null,
      errorMessage: 'Tu n’as pas fournis les bons documents',
    })
  })
})

const renderGetStepperInfo = () =>
  renderHook(() => useGetStepperInfo(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
