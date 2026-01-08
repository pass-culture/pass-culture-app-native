import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'

import { mockArtists } from 'features/artist/fixtures/mockArtist'
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

  it('should execute modal closing when pressing an artist item', async () => {
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

  it('should navigate to artist page when pressing an artist item', async () => {
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
})
