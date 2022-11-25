import React from 'react'

import { SearchFilter } from 'features/search/pages/SearchFilter/SearchFilter'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

// eslint-disable-next-line local-rules/no-react-query-provider-hoc
const renderSearchFilter = () => render(reactQueryProviderHOC(<SearchFilter />))
describe('<SearchFilter/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderSearchFilter()

      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
    })
  })
})
