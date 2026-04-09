import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum, SubcategoryResponseModelv2 } from 'api/gen'
import { AdvicesOfferColumn } from 'features/advices/components/AdvicesOfferColumn/AdvicesOfferColumn.web'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { subcategoriesMappingSnap } from 'libs/subcategories/fixtures/mappings'
import { SubcategoriesMapping } from 'libs/subcategories/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils/web'

useRoute.mockReturnValue({
  params: {
    offerId: offerResponseSnap.id,
  },
})

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/navigation/helpers/openUrl')

const mockBookClubOffer = {
  ...offerResponseSnap,
  subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
}

describe('AdvicesOfferColumn', () => {
  describe('Mobile displaying', () => {
    describe('Book Club subcategory', () => {
      it('should not display booking button when offer subcategory is in book club subcategories', () => {
        render(
          reactQueryProviderHOC(
            <AdvicesOfferColumn
              offer={mockBookClubOffer}
              onPress={jest.fn()}
              subcategoriesMapping={subcategoriesMappingSnap as SubcategoriesMapping}
              subcategory={
                subcategoriesMappingSnap[
                  mockBookClubOffer.subcategoryId
                ] as SubcategoryResponseModelv2
              }
            />
          ),
          {
            theme: {
              isDesktopViewport: false,
            },
          }
        )

        expect(screen.queryByText("Réserver l'offre")).not.toBeInTheDocument()
      })
    })

    describe('Cine Club subcategory', () => {
      it('should not display session button when offer subscategory is in cine club subcategories', () => {
        render(
          reactQueryProviderHOC(
            <AdvicesOfferColumn
              offer={offerResponseSnap}
              onPress={jest.fn()}
              subcategoriesMapping={subcategoriesMappingSnap as SubcategoriesMapping}
              subcategory={
                subcategoriesMappingSnap[
                  offerResponseSnap.subcategoryId
                ] as SubcategoryResponseModelv2
              }
            />
          ),
          {
            theme: {
              isDesktopViewport: false,
            },
          }
        )

        expect(screen.queryByText('Trouve ta séance')).not.toBeInTheDocument()
      })
    })
  })

  describe('Desktop displaying', () => {
    describe('Cine Club subcategory', () => {
      it('should render correctly', () => {
        render(
          reactQueryProviderHOC(
            <AdvicesOfferColumn
              offer={offerResponseSnap}
              onPress={jest.fn()}
              subcategoriesMapping={subcategoriesMappingSnap as SubcategoriesMapping}
              subcategory={
                subcategoriesMappingSnap[
                  offerResponseSnap.subcategoryId
                ] as SubcategoryResponseModelv2
              }
            />
          ),
          {
            theme: {
              isDesktopViewport: true,
            },
          }
        )

        expect(screen.getByText('Sous les étoiles de Paris - VF')).toBeInTheDocument()
        expect(screen.getByText('5,00 €')).toBeInTheDocument()
      })

      it('should display session button when offer subcategory is in cine club subcategories', () => {
        render(
          reactQueryProviderHOC(
            <AdvicesOfferColumn
              offer={offerResponseSnap}
              onPress={jest.fn()}
              subcategoriesMapping={subcategoriesMappingSnap as SubcategoriesMapping}
              subcategory={
                subcategoriesMappingSnap[
                  offerResponseSnap.subcategoryId
                ] as SubcategoryResponseModelv2
              }
            />
          ),
          {
            theme: {
              isDesktopViewport: true,
            },
          }
        )

        expect(screen.getByText('Trouve ta séance')).toBeInTheDocument()
      })
    })

    describe('Book Club subcategory', () => {
      it('should display booking button when offer subcategory is in book club subcategories', () => {
        render(
          reactQueryProviderHOC(
            <AdvicesOfferColumn
              offer={mockBookClubOffer}
              onPress={jest.fn()}
              subcategoriesMapping={subcategoriesMappingSnap as SubcategoriesMapping}
              subcategory={
                subcategoriesMappingSnap[
                  mockBookClubOffer.subcategoryId
                ] as SubcategoryResponseModelv2
              }
            />
          ),
          {
            theme: {
              isDesktopViewport: true,
            },
          }
        )

        expect(screen.getByText('Réserver l’offre')).toBeInTheDocument()
      })
    })
  })
})
