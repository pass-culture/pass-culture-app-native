import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'

import {
  mockArtists,
  mockArtistWithoutId,
  mockMixedArtists,
  mockArtistsWithoutIds,
} from 'features/artist/fixtures/mockArtist'
import { OfferArtistsModal } from 'features/offer/pages/OfferArtistsModal/OfferArtistsModal'
import { render, screen, userEvent } from 'tests/utils'

const mockNavigate = jest.fn()
jest.spyOn(reactNavigationNative, 'useNavigation').mockReturnValue({
  navigate: mockNavigate,
  push: jest.fn(),
})
const mockCloseModal = jest.fn()

const user = userEvent.setup()

jest.useFakeTimers()

describe('OfferArtistsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display correctly', () => {
    render(
      <OfferArtistsModal
        isVisible
        closeModal={jest.fn()}
        artists={mockArtists}
        navigateTo={{ screen: 'Artist' }}
      />
    )

    expect(screen.getByText('Avril Lavigne')).toBeOnTheScreen()
    expect(screen.getByText('Lady Gaga')).toBeOnTheScreen()
  })

  it('should execute modal closing when pressing close button', async () => {
    render(
      <OfferArtistsModal
        isVisible
        closeModal={mockCloseModal}
        artists={mockArtists}
        navigateTo={{ screen: 'Artist' }}
      />
    )

    await user.press(screen.getByLabelText('Fermer la modale'))

    expect(mockCloseModal).toHaveBeenCalledTimes(1)
  })

  it('should execute modal closing when pressing an artist item with ID', async () => {
    render(
      <OfferArtistsModal
        isVisible
        closeModal={mockCloseModal}
        artists={mockArtists}
        navigateTo={{ screen: 'Artist' }}
      />
    )

    await user.press(screen.getByText('Avril Lavigne'))

    expect(mockCloseModal).toHaveBeenCalledTimes(1)
  })

  it('should navigate to artist page when pressing an artist item with ID', async () => {
    render(
      <OfferArtistsModal
        isVisible
        closeModal={jest.fn()}
        artists={mockArtists}
        navigateTo={{ screen: 'Artist' }}
      />
    )
    await user.press(screen.getByText('Avril Lavigne'))

    expect(mockNavigate).toHaveBeenCalledWith('Artist', {
      id: 'cb22d035-f081-4ccb-99d8-8f5725a8ac9c',
    })
  })

  describe('with mixed artists (with and without IDs)', () => {
    it('should display all artists', () => {
      render(
        <OfferArtistsModal
          isVisible
          closeModal={jest.fn()}
          artists={mockMixedArtists}
          navigateTo={{ screen: 'Artist' }}
        />
      )

      expect(screen.getByText('Avril Lavigne')).toBeOnTheScreen()
      expect(screen.getByText(mockArtistWithoutId.name)).toBeOnTheScreen()
      expect(screen.getByText('Lady Gaga')).toBeOnTheScreen()
    })

    it('should NOT navigate when pressing artist without ID', async () => {
      render(
        <OfferArtistsModal
          isVisible
          closeModal={mockCloseModal}
          artists={mockMixedArtists}
          navigateTo={{ screen: 'Artist' }}
        />
      )

      await user.press(screen.getByText(mockArtistWithoutId.name))

      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockCloseModal).not.toHaveBeenCalled()
    })

    it('should navigate when pressing artist with ID', async () => {
      render(
        <OfferArtistsModal
          isVisible
          closeModal={mockCloseModal}
          artists={mockMixedArtists}
          navigateTo={{ screen: 'Artist' }}
        />
      )

      await user.press(screen.getByText('Avril Lavigne'))

      expect(mockNavigate).toHaveBeenCalledWith('Artist', {
        id: 'cb22d035-f081-4ccb-99d8-8f5725a8ac9c',
      })
      expect(mockCloseModal).toHaveBeenCalledTimes(1)
    })
  })

  describe('with only artists without IDs', () => {
    it('should display all artists', () => {
      render(
        <OfferArtistsModal
          isVisible
          closeModal={jest.fn()}
          artists={mockArtistsWithoutIds}
          navigateTo={{ screen: 'Artist' }}
        />
      )

      expect(screen.getByText('Artiste Sans Page 1')).toBeOnTheScreen()
      expect(screen.getByText('Artiste Sans Page 2')).toBeOnTheScreen()
    })

    it('should NOT navigate when pressing any artist', async () => {
      render(
        <OfferArtistsModal
          isVisible
          closeModal={mockCloseModal}
          artists={mockArtistsWithoutIds}
          navigateTo={{ screen: 'Artist' }}
        />
      )

      await user.press(screen.getByText('Artiste Sans Page 1'))

      expect(mockNavigate).not.toHaveBeenCalled()
      expect(mockCloseModal).not.toHaveBeenCalled()
    })
  })
})
