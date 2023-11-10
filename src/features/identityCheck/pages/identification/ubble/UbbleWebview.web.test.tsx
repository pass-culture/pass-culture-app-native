import React from 'react'

import { IdentificationSessionResponse } from 'api/gen'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { UbbleWebview } from './UbbleWebview'

describe('<UbbleWebview/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      mockServer.postApiV1<IdentificationSessionResponse>('/ubble_identification', {
        identificationUrl: 'http://ubble.webview.com',
      })

      const { container } = render(reactQueryProviderHOC(<UbbleWebview />))

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
