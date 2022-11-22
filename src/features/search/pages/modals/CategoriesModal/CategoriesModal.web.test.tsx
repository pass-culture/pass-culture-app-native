import React from 'react'

import { render } from 'tests/utils/web'

import { CategoriesModal } from './CategoriesModal'

describe('Categories component', () => {
  it('should display mobile header modal if mobile viewport', () => {
    const { getByTestId } = render(
      <CategoriesModal
        title="Catégories"
        accessibilityLabel="Ne pas filtrer sur les catégories et retourner aux résultats"
        isVisible
        hideModal={jest.fn()}
      />,
      {
        theme: { isDesktopViewport: false, isMobileViewport: true },
      }
    )

    const pageHeader = getByTestId('pageHeader')

    expect(pageHeader).toBeTruthy()
  })
})
