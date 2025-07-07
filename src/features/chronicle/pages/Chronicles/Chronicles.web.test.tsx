import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum } from 'api/gen'
import { offerChroniclesFixture } from 'features/chronicle/fixtures/offerChronicles.fixture'
import { Chronicles } from 'features/chronicle/pages/Chronicles/Chronicles'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils/web'

useRoute.mockReturnValue({
  params: {
    offerId: offerResponseSnap.id,
  },
})

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/navigation/helpers/openUrl')

describe('Chronicles', () => {
  beforeEach(() => {
    mockServer.getApi(`/v1/offer/${offerResponseSnap.id}/chronicles`, offerChroniclesFixture)
    mockServer.getApi('/v1/subcategories/v2', subcategoriesDataTest)
  })

  describe('Mobile displaying', () => {
    describe('Book Club subcategory', () => {
      beforeEach(() => {
        mockServer.getApi(`/v2/offer/${offerResponseSnap.id}`, {
          ...offerResponseSnap,
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        })
      })

      it('should render correctly', async () => {
        render(reactQueryProviderHOC(<Chronicles />), {
          theme: {
            isDesktopViewport: false,
          },
        })

        expect(await screen.findByText('Tous les avis')).toBeInTheDocument()
        expect(screen.getAllByTestId(/chronicle-*/).length).toBeGreaterThan(0)
      })

      it('should not display booking button when offer subscategory is in book club subcategories', async () => {
        render(reactQueryProviderHOC(<Chronicles />), {
          theme: {
            isDesktopViewport: false,
          },
        })

        expect(await screen.findByText('Tous les avis')).toBeInTheDocument()
        expect(screen.queryByText("Réserver l'offre")).not.toBeInTheDocument()
      })
    })

    describe('Cine Club subcategory', () => {
      beforeEach(() => {
        mockServer.getApi(`/v2/offer/${offerResponseSnap.id}`, {
          ...offerResponseSnap,
          subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        })
      })

      it('should not display session button when offer subscategory is in cine club subcategories', async () => {
        render(reactQueryProviderHOC(<Chronicles />), {
          theme: {
            isDesktopViewport: false,
          },
        })

        expect(await screen.findByText('Tous les avis')).toBeInTheDocument()
        expect(screen.queryByText('Trouve ta séance')).not.toBeInTheDocument()
      })
    })
  })

  describe('Desktop displaying', () => {
    describe('Cine Club subcategory', () => {
      beforeEach(() => {
        mockServer.getApi(`/v2/offer/${offerResponseSnap.id}`, {
          ...offerResponseSnap,
          subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        })
      })

      it('should render correctly', async () => {
        render(reactQueryProviderHOC(<Chronicles />), {
          theme: {
            isDesktopViewport: true,
          },
        })

        expect(await screen.findByText('Tous les avis')).toBeInTheDocument()
        expect(screen.getByText('Sous les étoiles de Paris - VF')).toBeInTheDocument()
        expect(screen.getByText('Dès 5,00 €')).toBeInTheDocument()
        expect(screen.getAllByTestId(/chronicle-*/).length).toBeGreaterThan(0)
      })

      it('should display session button when offer subscategory is in cine club subcategories', async () => {
        render(reactQueryProviderHOC(<Chronicles />), {
          theme: {
            isDesktopViewport: true,
          },
        })

        expect(await screen.findByText('Tous les avis')).toBeInTheDocument()
        expect(screen.getByText('Trouve ta séance')).toBeInTheDocument()
      })

      it('should redirect to offer page when pressing session button and offer subscategory is in cine club subcategories', async () => {
        render(reactQueryProviderHOC(<Chronicles />), {
          theme: {
            isDesktopViewport: true,
          },
        })

        await screen.findByText('Tous les avis')

        fireEvent.click(screen.getByText('Trouve ta séance'))

        expect(navigate).toHaveBeenCalledWith('Offer', {
          id: offerResponseSnap.id,
          from: 'chronicles',
        })
      })
    })

    describe('Book Club subcategory', () => {
      beforeEach(() => {
        mockServer.getApi(`/v2/offer/${offerResponseSnap.id}`, {
          ...offerResponseSnap,
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        })
      })

      it('should display booking button when offer subscategory is in book club subcategories', async () => {
        render(reactQueryProviderHOC(<Chronicles />), {
          theme: {
            isDesktopViewport: true,
          },
        })

        expect(await screen.findByText('Réserver l’offre')).toBeInTheDocument()
      })
    })
  })
})
