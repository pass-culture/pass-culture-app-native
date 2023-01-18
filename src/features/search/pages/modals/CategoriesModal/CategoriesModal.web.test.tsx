import React from 'react'

import { FilterBehaviourEnum } from 'features/search/enums'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { CategoriesModal } from './CategoriesModal'

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('<CategoriesModal/>', () => {
  it('should display mobile header modal if mobile viewport', () => {
    const { getByTestId } = render(
      <CategoriesModal
        accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
        isVisible
        hideModal={jest.fn()}
        filterBehaviour={FilterBehaviourEnum.SEARCH}
      />
    )

    const pageHeader = getByTestId('pageHeader')

    expect(pageHeader).toBeTruthy()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <CategoriesModal
          accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
          isVisible
          hideModal={jest.fn()}
          filterBehaviour={FilterBehaviourEnum.SEARCH}
        />
      )
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have any arrow next', () => {
      const { queryAllByLabelText } = render(
        <CategoriesModal
          accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
          isVisible
          hideModal={jest.fn()}
          filterBehaviour={FilterBehaviourEnum.SEARCH}
        />,
        { theme: { isDesktopViewport: true } }
      )

      expect(queryAllByLabelText('Affiner la recherche')).toHaveLength(0)
    })
  })
})
