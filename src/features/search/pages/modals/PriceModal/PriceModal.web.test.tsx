import React from 'react'

import { FilterBehaviourEnum } from 'features/search/enums'
import { render, act, checkAccessibilityFor } from 'tests/utils/web'

import { PriceModal } from './PriceModal'

jest.mock('react-query')

jest.mock('features/auth/context/AuthContext')

describe('<PriceModal/>', () => {
  it('should display mobile header modal if mobile viewport', async () => {
    const { getByTestId } = render(
      <PriceModal
        title="Prix"
        accessibilityLabel="Ne pas filtrer sur les prix et retourner aux résultats"
        isVisible
        hideModal={jest.fn()}
        filterBehaviour={FilterBehaviourEnum.SEARCH}
      />
    )

    const pageHeader = getByTestId('pageHeader')

    await act(async () => {
      expect(pageHeader).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <PriceModal
          title="Prix"
          accessibilityLabel="Ne pas filtrer sur les prix et retourner aux résultats"
          isVisible
          hideModal={jest.fn()}
          filterBehaviour={FilterBehaviourEnum.SEARCH}
        />
      )
      await act(async () => {
        const results = await checkAccessibilityFor(container)
        expect(results).toHaveNoViolations()
      })
    })
  })
})
