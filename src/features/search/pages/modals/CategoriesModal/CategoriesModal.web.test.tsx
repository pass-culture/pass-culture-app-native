import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { FilterBehaviour } from 'features/search/enums'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { CategoriesModal } from './CategoriesModal'

jest.mock('libs/subcategories/useSubcategories')

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

describe('<CategoriesModal/>', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should display mobile header modal if mobile viewport', () => {
    render(
      <CategoriesModal
        accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
        isVisible
        hideModal={jest.fn()}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
    )

    const pageHeader = screen.getByTestId('pageHeader')

    expect(pageHeader).toBeInTheDocument()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <CategoriesModal
          accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
          isVisible
          hideModal={jest.fn()}
          filterBehaviour={FilterBehaviour.SEARCH}
        />
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
