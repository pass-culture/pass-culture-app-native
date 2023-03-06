import { rest } from 'msw'
import React from 'react'

import { IdentificationSessionResponse } from 'api/gen'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { UbbleWebview } from './UbbleWebview'

server.use(
  rest.post<IdentificationSessionResponse, IdentificationSessionResponse>(
    env.API_BASE_URL + '/native/v1/ubble_identification',
    (_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          identificationUrl: 'http://ubble.webview.com',
        })
      )
    }
  )
)

describe('<UbbleWebview/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      // eslint-disable-next-line local-rules/no-react-query-provider-hoc
      const { container } = render(reactQueryProviderHOC(<UbbleWebview />))

      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
    })
  })
})
