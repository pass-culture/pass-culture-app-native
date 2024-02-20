import React from 'react'

import { FilterBehaviour } from 'features/search/enums'
import { screen, render } from 'tests/utils'

import { AccessibilityFiltersModal, AccessibilityModalProps } from './AccessibilityFiltersModal'

describe('<AccessibilityFiltersModal />', () => {
  it('should render modal correctly', async () => {
    renderAccessibilityFiltersModal()
    await screen.findByText(
      'Filtrer par l’accessibilité des lieux en fonction d’un ou plusieurs handicaps'
    )

    expect(screen).toMatchSnapshot()
  })

  it('should have a touchable search button', async () => {
    renderAccessibilityFiltersModal()
    const searchButton = await screen.findByLabelText('Rechercher')

    expect(searchButton).toBeEnabled()
  })
})

function renderAccessibilityFiltersModal({
  filterBehaviour = FilterBehaviour.SEARCH,
}: Partial<AccessibilityModalProps> = {}) {
  const mockHideModal = jest.fn()
  const mockOnClose = jest.fn()
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
