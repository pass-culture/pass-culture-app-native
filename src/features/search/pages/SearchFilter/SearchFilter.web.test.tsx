import React from 'react'

import { SearchFilter } from 'features/search/pages/SearchFilter/SearchFilter'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen, waitFor } from 'tests/utils/web'

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

  it('should display back button on header', async () => {
    renderSearchFilter()

    await waitFor(() => {
      expect(screen.getByTestId('Revenir en arrière')).toBeTruthy()
    })
  })

  it('should not display close button on header', async () => {
    renderSearchFilter()

    await waitFor(() => {
      expect(screen.queryByTestId('Fermer')).toBeFalsy()
    })
  })
})

const renderSearchFilter = () =>
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  render(reactQueryProviderHOC(<SearchFilter />), {
    theme: { isDesktopViewport: true, isMobileViewport: false },
  })
