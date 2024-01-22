import React from 'react'

import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { fireEvent, render, screen } from 'tests/utils'

import { VenueSelectionModal } from './VenueSelectionModal'

jest.mock('libs/location')

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

  it('should render items', () => {
    render(
      <VenueSelectionModal
        isVisible
        items={items}
        title="Lieu de retrait"
        onSubmit={jest.fn()}
        onClosePress={jest.fn()}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
      />
    )

    expect(screen.queryAllByTestId('venue-selection-list-item')).toHaveLength(3)
  })

  it('should close modal', () => {
    const onClose = jest.fn()

    render(
      <VenueSelectionModal
        isVisible
        items={items}
        title="Lieu de retrait"
        onSubmit={jest.fn()}
        onClosePress={onClose}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
      />
    )

    fireEvent.press(screen.getByTestId('Ne pas sélectionner un autre lieu'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should not call onSubmit with no selection', () => {
    const onSubmit = jest.fn()

    render(
      <VenueSelectionModal
        isVisible
        items={items}
        title="Lieu de retrait"
        onSubmit={onSubmit}
        onClosePress={jest.fn()}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
      />
    )

    fireEvent.press(screen.getByText('Choisir ce lieu'))

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should call onSubmit with item selected', () => {
    const onSubmit = jest.fn()

    render(
      <VenueSelectionModal
        isVisible
        items={items}
        title="Lieu de retrait"
        onSubmit={onSubmit}
        onClosePress={jest.fn()}
        nbLoadedHits={nbLoadedHits}
        nbHits={nbHits}
        isFetchingNextPage
      />
    )

    fireEvent.press(screen.getByText('Hachette Livre'))
    fireEvent.press(screen.getByText('Choisir ce lieu'))

    expect(onSubmit).toHaveBeenNthCalledWith(1, 3)
  })

  describe('When user share his position', () => {
    it('should not display "Active ta géolocalisation" button', () => {
      render(
        <VenueSelectionModal
          isVisible
          items={items}
          title="Lieu de retrait"
          onSubmit={jest.fn()}
          onClosePress={jest.fn()}
          nbLoadedHits={nbLoadedHits}
          nbHits={nbHits}
          isFetchingNextPage
          isSharingLocation
          venueName="LIBRAIRIE SILLAGE"
        />
      )

      expect(screen.queryByText('Active ta géolocalisation')).not.toBeOnTheScreen()
    })

    it('should display "Lieux disponibles autour de moi"', () => {
      render(
        <VenueSelectionModal
          isVisible
          items={items}
          title="Lieu de retrait"
          onSubmit={jest.fn()}
          onClosePress={jest.fn()}
          nbLoadedHits={nbLoadedHits}
          nbHits={nbHits}
          isFetchingNextPage
          isSharingLocation
          venueName="LIBRAIRIE SILLAGE"
        />
      )

      expect(screen.getByText('Lieux disponibles autour de moi')).toBeOnTheScreen()
    })

    it('should not display "Lieux à proximité de “LIBRAIRIE SILLAGE”" (offer venue name)', () => {
      render(
        <VenueSelectionModal
          isVisible
          items={items}
          title="Lieu de retrait"
          onSubmit={jest.fn()}
          onClosePress={jest.fn()}
          nbLoadedHits={nbLoadedHits}
          nbHits={nbHits}
          isFetchingNextPage
          isSharingLocation
          venueName="LIBRAIRIE SILLAGE"
        />
      )

      expect(screen.queryByText('Lieux à proximité de “LIBRAIRIE SILLAGE”')).not.toBeOnTheScreen()
    })
  })

  describe('When user not share his position', () => {
    it('should display "Active ta géolocalisation" button', () => {
      render(
        <VenueSelectionModal
          isVisible
          items={items}
          title="Lieu de retrait"
          onSubmit={jest.fn()}
          onClosePress={jest.fn()}
          nbLoadedHits={nbLoadedHits}
          nbHits={nbHits}
          isFetchingNextPage
          isSharingLocation={false}
          venueName="LIBRAIRIE SILLAGE"
        />
      )

      expect(screen.getByText('Active ta géolocalisation')).toBeOnTheScreen()
    })

    it('should not display "Lieux disponibles autour de moi"', () => {
      render(
        <VenueSelectionModal
          isVisible
          items={items}
          title="Lieu de retrait"
          onSubmit={jest.fn()}
          onClosePress={jest.fn()}
          nbLoadedHits={nbLoadedHits}
          nbHits={nbHits}
          isFetchingNextPage
          isSharingLocation={false}
          venueName="LIBRAIRIE SILLAGE"
        />
      )

      expect(screen.queryByText('Lieux disponibles autour de moi')).not.toBeOnTheScreen()
    })

    it('should display "Lieux à proximité de “LIBRAIRIE SILLAGE”" (offer venue name)', () => {
      render(
        <VenueSelectionModal
          isVisible
          items={items}
          title="Lieu de retrait"
          onSubmit={jest.fn()}
          onClosePress={jest.fn()}
          nbLoadedHits={nbLoadedHits}
          nbHits={nbHits}
          isFetchingNextPage
          isSharingLocation={false}
          venueName="LIBRAIRIE SILLAGE"
        />
      )

      expect(screen.getByText('Lieux à proximité de “LIBRAIRIE SILLAGE”')).toBeOnTheScreen()
    })
  })
})
