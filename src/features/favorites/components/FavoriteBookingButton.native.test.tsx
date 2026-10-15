import React from 'react'

import { FavoriteBookingButton } from 'features/favorites/components/FavoriteBookingButton'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { render, screen, userEvent } from 'tests/utils'

const mockOnOpenModal = jest.fn()
const openUrlSpy = jest.spyOn(NavigationHelpers, 'openUrl')

const user = userEvent.setup()
jest.useFakeTimers()

describe('FavoriteBookingButton', () => {
  describe('when wording is missing or empty', () => {
    it('should render nothing when wording is undefined', () => {
      render(
        <FavoriteBookingButton
          buttonProperties={{ wording: undefined }}
          onOpenModal={mockOnOpenModal}
        />
      )

      expect(screen.toJSON()).toBeNull()
    })

    it('should render nothing when wording is an empty string', () => {
      render(
        <FavoriteBookingButton buttonProperties={{ wording: '' }} onOpenModal={mockOnOpenModal} />
      )

      expect(screen.toJSON()).toBeNull()
    })
  })

  it('should display external touchable link and redirect on external site when external nav defined', async () => {
    const externalNav = { url: 'https://example.com' } as const
    const buttonProperties = {
      wording: 'Ouvrir sur le site partenaire',
      externalNav,
      accessibilityLabel: 'Ouvrir sur le site partenaire',
    }

    render(
      <FavoriteBookingButton buttonProperties={buttonProperties} onOpenModal={mockOnOpenModal} />
    )

    await user.press(screen.getByText('Ouvrir sur le site partenaire'))

    expect(openUrlSpy).toHaveBeenCalledWith('https://example.com', undefined, true)
  })

  describe('when externalNav is not provided', () => {
    it('should render standard button without external redirection', async () => {
      render(
        <FavoriteBookingButton
          buttonProperties={{ wording: 'Réserver', disabled: true }}
          onOpenModal={mockOnOpenModal}
        />
      )

      await user.press(screen.getByText('Réserver'))

      expect(openUrlSpy).not.toHaveBeenCalled()
    })

    it('should execute both onPress and onOpenModal when pressed', async () => {
      const mockOnPress = jest.fn()

      render(
        <FavoriteBookingButton
          buttonProperties={{ wording: 'Réserver', onPress: mockOnPress }}
          onOpenModal={mockOnOpenModal}
        />
      )

      await user.press(screen.getByText('Réserver'))

      expect(mockOnPress).toHaveBeenCalledTimes(1)
      expect(mockOnOpenModal).toHaveBeenCalledTimes(1)
    })
  })
})
