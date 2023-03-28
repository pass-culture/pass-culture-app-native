import { rest } from 'msw'

import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import { SubscriptionStepperResponseFixture } from 'features/identityCheck/pages/helpers/stepperInfo.fixture'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

describe('useGetStepperInfo', () => {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/subscription/stepper', (_req, res, ctx) =>
      res(ctx.status(200), ctx.json(SubscriptionStepperResponseFixture))
    )
  )
  it('should get stepsToDisplay from the back', async () => {
    const result = renderGetStepperInfo()

    await waitFor(() => {
      expect(result.result.current).toEqual({
        stepToDisplay: SubscriptionStepperResponseFixture.subscriptionStepsToDisplay,
      })
    })
  })
  it('should return an empty stepsToDisplay list if the data are undefined', async () => {
    server.use(
      rest.get(env.API_BASE_URL + '/native/v1/subscription/stepper', (_req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.json({ ...SubscriptionStepperResponseFixture, subscriptionStepsToDisplay: undefined })
        )
      )
    )
    const result = renderGetStepperInfo()

    await waitFor(() => {
      expect(result.result.current).toEqual({
        stepToDisplay: [],
      })
    })
  })
})

const renderGetStepperInfo = () =>
  renderHook(() => useGetStepperInfo(), {
    /* eslint-disable local-rules/no-react-query-provider-hoc */
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
