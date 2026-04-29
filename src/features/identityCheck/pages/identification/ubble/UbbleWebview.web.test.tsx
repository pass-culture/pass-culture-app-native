import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { IdentificationSessionResponse, SubscriptionStepperResponseV2 } from 'api/gen'
import { SubscriptionStepperErrorResponseFixture } from 'features/identityCheck/pages/helpers/stepperInfo.fixture'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { UbbleWebview } from './UbbleWebview'

describe('<UbbleWebview/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockServer.postApi<IdentificationSessionResponse>('/v1/ubble_identification', {
        identificationUrl: 'http://ubble.webview.com',
      })

      mockServer.getApi<SubscriptionStepperResponseV2>(
        '/v2/subscription/stepper',
        SubscriptionStepperErrorResponseFixture
      )

      const { container } = render(reactQueryProviderHOC(<UbbleWebview />))

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  }),
    describe('Identification URL', () => {
      it('should redirect to Error page if', async () => {
        mockServer.postApi<IdentificationSessionResponse>('/v1/ubble_identification', {
          identificationUrl: "javascript:alert('hello')",
        })

        mockServer.getApi<SubscriptionStepperResponseV2>(
          '/v2/subscription/stepper',
          SubscriptionStepperErrorResponseFixture
        )

        render(reactQueryProviderHOC(<UbbleWebview />))

        await act(async () => {
          expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
            params: undefined,
            screen: 'BonificationError',
          })
        })
      })
    })
})
