import React from 'react'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum } from 'api/gen'
import { offerClubAdvicesFixture } from 'features/clubAdvices/fixtures/clubAdvices.fixture'
import { ClubAdvices } from 'features/clubAdvices/pages/ClubAdvices/ClubAdvices'
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

describe('ClubAdvices', () => {
  beforeEach(() => {
    mockServer.getApi(`/v1/offer/${offerResponseSnap.id}/chronicles`, offerClubAdvicesFixture)
    mockServer.getApi('/v1/subcategories/v2', subcategoriesDataTest)
  })

  describe('Mobile displaying', () => {
    describe('Book Club subcategory', () => {
      beforeEach(() => {
        mockServer.getApi(`/v3/offer/${offerResponseSnap.id}`, {
          ...offerResponseSnap,
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
        })
      })

      it('should render correctly', async () => {
        render(reactQueryProviderHOC(<ClubAdvices />), {
          theme: {
            isDesktopViewport: false,
          },
        })

        expect(await screen.findByText('Tous les avis du book club')).toBeInTheDocument()
        expect(screen.getAllByTestId(/advice-*/).length).toBeGreaterThan(0)
      })
    })
  })

  describe('Desktop displaying', () => {
    describe('Cine Club subcategory', () => {
      beforeEach(() => {
        mockServer.getApi(`/v3/offer/${offerResponseSnap.id}`, {
          ...offerResponseSnap,
          subcategoryId: SubcategoryIdEnum.SEANCE_CINE,
        })
      })

      it('should render correctly', async () => {
        render(reactQueryProviderHOC(<ClubAdvices />), {
          theme: {
            isDesktopViewport: true,
          },
        })

        expect(await screen.findByText('Tous les avis du ciné club')).toBeInTheDocument()
        expect(screen.getByText('Sous les étoiles de Paris - VF')).toBeInTheDocument()
        expect(screen.getByText('5,00 €')).toBeInTheDocument()
        expect(screen.getAllByTestId(/advice-*/).length).toBeGreaterThan(0)
      })

      it('should redirect to offer page when pressing session button and offer subcategory is in cine club subcategories', async () => {
        render(reactQueryProviderHOC(<ClubAdvices />), {
          theme: {
            isDesktopViewport: true,
          },
        })

        await screen.findByText('Tous les avis du ciné club')

        fireEvent.click(screen.getByText('Trouve ta séance'))

        expect(navigate).toHaveBeenCalledWith('Offer', {
          id: offerResponseSnap.id,
          from: 'chronicles',
        })
      })
    })
  })
})
