import React from 'react'

import { FilterBehaviour } from 'features/search/enums'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { AccessibilityFiltersModal, AccessibilityModalProps } from './AccessibilityFiltersModal'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<AccessibilityFiltersModal />', () => {
  it('should display mobile header modal if mobile viewport', () => {
    renderAccessibilityFiltersModal()
    const pageHeader = screen.getByTestId('pageHeader')

    expect(pageHeader).toBeInTheDocument()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderAccessibilityFiltersModal()
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

function renderAccessibilityFiltersModal({
  filterBehaviour = FilterBehaviour.SEARCH,
}: Partial<AccessibilityModalProps> = {}) {
  const mockHideModal = () => jest.fn()
  const mockOnClose = () => jest.fn()
  return render(
    <AccessibilityFiltersModal
      title="Accessibilité"
      accessibilityLabel="Ne pas filtrer sur les lieux accessibles puis retourner aux résultats"
      isVisible
      hideModal={mockHideModal}
      filterBehaviour={filterBehaviour}
      onClose={mockOnClose}
    />
  )
}
