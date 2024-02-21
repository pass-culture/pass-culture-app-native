import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'

import { VenueListItem } from '../VenueSelectionList/VenueSelectionList'

import { VenueSelectionModal } from './VenueSelectionModal'

describe('<VenueSelectionModal />', () => {
  const items: VenueListItem[] = [
    {
      title: 'Envie de lire',
      address: '94200 Ivry-sur-Seine, 16 rue Gabriel Peri',
      distance: '500 m',
      offerId: 1,
    },
    {
      title: 'Le Livre Éclaire',
      address: '75013 Paris, 56 rue de Tolbiac',
      distance: '1,5 km',
      offerId: 2,
    },
    {
      title: 'Hachette Livre',
      address: '94200 Ivry-sur-Seine, Rue Charles du Colomb',
      distance: '2,4 km',
      offerId: 3,
    },
  ]

  const nbLoadedHits = 3
  const nbHits = 40

  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <VenueSelectionModal
        headerMessage=""
        subTitle=""
        rightIconAccessibilityLabel=""
        validateButtonLabel=""
        isVisible
        items={items}
        title="Lieu de retrait"
        onSubmit={jest.fn()}
        onClosePress={jest.fn()}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
        isSharingLocation
        onEndReached={jest.fn()}
      />
    )

    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})
