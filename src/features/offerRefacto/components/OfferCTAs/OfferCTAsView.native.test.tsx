import React from 'react'
import { DefaultTheme } from 'styled-components/native'

import * as useOfferCTAContextModule from 'features/offer/components/OfferContent/OfferCTAProvider'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferCTAsView } from 'features/offerRefacto/components/OfferCTAs/OfferCTAsView'
import { render, screen } from 'tests/utils'
import { theme } from 'theme'

jest.mock('libs/firebase/analytics/analytics')

const mockFavoriteCTAProps = {
  favorite: undefined,
  isAddFavoriteLoading: false,
  isRemoveFavoriteLoading: false,
  addFavorite: jest.fn(),
  removeFavorite: jest.fn(),
}

const defaultViewModel = {
  ctaProps: {
    wording: 'Book',
    onPress: jest.fn(),
    onFavoritePress: jest.fn(),
    onReminderPress: jest.fn(),
  },
  CTAOfferModal: null,
  favoriteAuthModal: {
    visible: false,
    showModal: jest.fn(),
    hideModal: jest.fn(),
    toggleModal: jest.fn(),
  },
  reminderAuthModal: {
    visible: false,
    showModal: jest.fn(),
    hideModal: jest.fn(),
    toggleModal: jest.fn(),
  },
  theme: theme as DefaultTheme,
  isFreeDigitalOffer: false,
  isLoggedIn: true,
  isAComingSoonOffer: false,
  showCineCTA: false,
  hasReminder: false,
}

jest.spyOn(useOfferCTAContextModule, 'useOfferCTA').mockReturnValue({
  wording: 'Cine content CTA',
  onPress: jest.fn(),
  setButton: jest.fn(),
  showButton: jest.fn(),
  isButtonVisible: false,
})

describe('OfferCTAsView', () => {
  describe('For coming soon offers', () => {
    it('should render favorites CTA on desktop', () => {
      const viewModel = {
        ...defaultViewModel,
        theme: { ...(theme as DefaultTheme), isDesktopViewport: true, isMobileViewport: false },
        isAComingSoonOffer: true,
      }
      render(
        <OfferCTAsView
          offer={offerResponseSnap}
          favoriteCTAProps={mockFavoriteCTAProps}
          viewModel={viewModel}
        />
      )

      expect(screen.getByText('Cette offre sera bientôt disponible')).toBeOnTheScreen()
    })

    it('should render reminders CTA on mobile', () => {
      const viewModel = {
        ...defaultViewModel,
        theme: { ...(theme as DefaultTheme), isDesktopViewport: false, isMobileViewport: true },
        isAComingSoonOffer: true,
      }
      render(
        <OfferCTAsView
          offer={offerResponseSnap}
          favoriteCTAProps={mockFavoriteCTAProps}
          viewModel={viewModel}
        />
      )

      expect(screen.getByText('Ajouter un rappel')).toBeOnTheScreen()
    })
  })

  it('should render cine CTA on mobile when showCineCTA is true', () => {
    const viewModel = {
      ...defaultViewModel,
      theme: { ...(theme as DefaultTheme), isDesktopViewport: false, isMobileViewport: true },
      showCineCTA: true,
    }
    render(
      <OfferCTAsView
        offer={offerResponseSnap}
        favoriteCTAProps={mockFavoriteCTAProps}
        viewModel={viewModel}
      />
    )

    expect(screen.getByText('Cine content CTA')).toBeOnTheScreen()
  })

  it('should display booking button on desktop when offer is not coming soon', () => {
    const viewModel = {
      ...defaultViewModel,
      theme: { ...(theme as DefaultTheme), isDesktopViewport: true, isMobileViewport: false },
    }
    render(
      <OfferCTAsView
        offer={offerResponseSnap}
        favoriteCTAProps={mockFavoriteCTAProps}
        viewModel={viewModel}
      />
    )

    expect(screen.getByTestId('booking-button')).toBeOnTheScreen()
  })

  it('should display sticky booking button on desktop when offer is not coming soon and not cinema', () => {
    const viewModel = {
      ...defaultViewModel,
      theme: { ...(theme as DefaultTheme), isDesktopViewport: false, isMobileViewport: true },
    }
    render(
      <OfferCTAsView
        offer={offerResponseSnap}
        favoriteCTAProps={mockFavoriteCTAProps}
        viewModel={viewModel}
      />
    )

    expect(screen.getByTestId('sticky-booking-button')).toBeOnTheScreen()
  })
})
