import { rest } from 'msw'

import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import {
  SubscriptionStepperErrorResponseFixture,
  SubscriptionStepperResponseFixture,
} from 'features/identityCheck/pages/helpers/stepperInfo.fixture'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

describe('useGetStepperInfo', () => {
  it('should get stepsToDisplay from the back', async () => {
    server.use(
      rest.get(env.API_BASE_URL + '/native/v1/subscription/stepper', (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(SubscriptionStepperResponseFixture))
      )
    )
    const result = renderGetStepperInfo()

    await waitFor(() => {
      expect(result.result.current).toEqual({
        stepToDisplay: SubscriptionStepperResponseFixture.subscriptionStepsToDisplay,
        title: 'Titre Stepper',
        subtitle: 'Sous titre Stepper',
      })
    })
  })
  it('should return an errorMessage', async () => {
    server.use(
      rest.get(env.API_BASE_URL + '/native/v1/subscription/stepper', (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(SubscriptionStepperErrorResponseFixture))
      )
    )
    const result = renderGetStepperInfo()

    await waitFor(() => {
      expect(result.result.current).toEqual({
        stepToDisplay: SubscriptionStepperErrorResponseFixture.subscriptionStepsToDisplay,
        title: 'Titre Stepper',
        subtitle: null,
        errorMessage: 'Tu n’as pas fournis les bons documents',
      })
    })
  })

  it('should return empty stepsToDisplay list and titles if the data is undefined', async () => {
    server.use(
      rest.get(env.API_BASE_URL + '/native/v1/subscription/stepper', (_req, res, ctx) =>
        res(ctx.status(200), ctx.json(undefined))
      )
    )
    const result = renderGetStepperInfo()

    await waitFor(() => {
      expect(result.result.current).toEqual({
        stepToDisplay: [],
        title: '',
      })
    })
  })
})

const renderGetStepperInfo = () =>
  renderHook(() => useGetStepperInfo(), {
    /* eslint-disable local-rules/no-react-query-provider-hoc */
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
