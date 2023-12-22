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
    mockServer.getApiV1<SubscriptionStepperResponse>(
      '/subscription/stepper',
      SubscriptionStepperResponseFixture
    )
    const result = renderGetStepperInfo()
    await act(async () => {})

    expect(result.result.current).toEqual({
      stepToDisplay: SubscriptionStepperResponseFixture.subscriptionStepsToDisplay,
      title: 'Titre Stepper',
      subtitle: 'Sous titre Stepper',
      identificationMethods: SubscriptionStepperResponseFixture.allowedIdentityCheckMethods,
    })
  })

  it('should return an errorMessage', async () => {
    mockServer.getApiV1<SubscriptionStepperResponse>(
      '/subscription/stepper',
      SubscriptionStepperErrorResponseFixture
    )

    const result = renderGetStepperInfo()
    await act(async () => {})

    expect(result.result.current).toEqual({
      stepToDisplay: SubscriptionStepperErrorResponseFixture.subscriptionStepsToDisplay,
      title: 'Titre Stepper',
      subtitle: null,
      errorMessage: 'Tu n’as pas fournis les bons documents',
      identificationMethods: SubscriptionStepperResponseFixture.allowedIdentityCheckMethods,
    })
  })

  it('should return empty stepsToDisplay list and titles if the data is undefined', async () => {
    mockServer.getApiV1('/subscription/stepper', { responseOptions: { data: undefined } })

    const result = renderGetStepperInfo()
    await act(async () => {})

    expect(result.result.current).toEqual({
      stepToDisplay: [],
      title: '',
    })
  })
})

const renderGetStepperInfo = () =>
  renderHook(() => useGetStepperInfo(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
