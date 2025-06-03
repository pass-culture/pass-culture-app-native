import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { FilterBehaviour } from 'features/search/enums'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { act, checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { PriceModal } from './PriceModal'

jest.mock('features/auth/context/AuthContext')

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

describe('<PriceModal/>', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it('should display mobile header modal if mobile viewport', async () => {
    render(
      <PriceModal
        title="Prix"
        accessibilityLabel="Ne pas filtrer sur les prix et retourner aux résultats"
        isVisible
        hideModal={jest.fn()}
        filterBehaviour={FilterBehaviour.SEARCH}
      />
    )

    const pageHeader = screen.getByTestId('pageHeader')

    await act(async () => {
      expect(pageHeader).toBeInTheDocument()
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
          filterBehaviour={FilterBehaviour.SEARCH}
        />
      )
      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
