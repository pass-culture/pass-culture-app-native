import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2, SubcategoryIdEnum } from 'api/gen'
import { Artist } from 'features/artist/pages/Artist'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import * as useGoBack from 'features/navigation/useGoBack'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'
jest.spyOn(useGoBack, 'useGoBack').mockReturnValue({
  goBack: jest.fn(),
  canGoBack: jest.fn(() => true),
})

const mockUseOfferQuery = jest.fn()
mockUseOfferQuery.mockReturnValue({
  data: {
    ...mockOffer,
    subcategoryId: SubcategoryIdEnum.SUPPORT_PHYSIQUE_MUSIQUE_CD,
    extraData: { performer: 'Céline Dion' },
  },
})
jest.mock('queries/offer/useOfferQuery', () => ({
  useOfferQuery: () => mockUseOfferQuery(),
}))

useRoute.mockReturnValue({
  params: {
    fromOfferId: 1,
  },
})

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/firebase/analytics/analytics')

const mockData: SubcategoriesResponseModelv2 | undefined = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

describe('<Artist />', () => {
  useRoute.mockReturnValue({
    params: {
      fromOfferId: 1,
    },
  })

  describe('When enablePageArtist feature flag activated', () => {
    beforeAll(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ARTIST_PAGE])
    })

    it('should display artist page content', async () => {
      render(reactQueryProviderHOC(<Artist />))

      expect((await screen.findAllByText('Céline Dion'))[0]).toBeOnTheScreen()
    })

    it('should not display artist page content when there is no artist', () => {
      mockUseOfferQuery.mockReturnValueOnce({
        data: {
          ...mockOffer,
          extraData: undefined,
        },
      })
      render(reactQueryProviderHOC(<Artist />))

      expect(screen.queryByText('Quelques infos à son sujet')).not.toBeOnTheScreen()
    })

    it('should not display artist page content when offer not found', () => {
      mockUseOfferQuery.mockReturnValueOnce({
        data: undefined,
      })
      render(reactQueryProviderHOC(<Artist />))

      expect(screen.queryByText('Quelques infos à son sujet')).not.toBeOnTheScreen()
    })
  })

  describe('When enablePageArtist feature flag deactivated', () => {
    beforeAll(() => {
      setFeatureFlags()
    })

    it('should page not found', () => {
      render(<Artist />)

      expect(screen.getByText('Page introuvable !')).toBeOnTheScreen()
    })
  })
})
