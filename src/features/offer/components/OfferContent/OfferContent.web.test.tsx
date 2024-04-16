import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Position } from 'libs/location'
import { SuggestedPlace } from 'libs/place/types'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils/web'

import { OfferContent } from './OfferContent'

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

let mockPosition: Position = { latitude: 90.4773245, longitude: 90.4773245 }
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockPosition,
    geolocPosition: mockPosition,
    place: Kourou,
  }),
}))

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

jest
  .spyOn(useSimilarOffers, 'useSimilarOffers')
  .mockReturnValue({ similarOffers: undefined, apiRecoParams: undefined })

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>

describe('<OfferContent />', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', placeholderData)
    mockPosition = { latitude: 90.4773245, longitude: 90.4773245 }
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: false,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
  })

  it('should not display linear gradient on offer image when enableOfferPreview feature flag activated', async () => {
    render(
      reactQueryProviderHOC(
        <OfferContent
          offer={offerResponseSnap}
          searchGroupList={placeholderData.searchGroups}
          subcategory={mockSubcategory}
        />
      )
    )

    await waitFor(async () => {
      expect(screen.queryByTestId('imageGradient')).not.toBeOnTheScreen()
    })
  })

  it('should not display tag on offer image when enableOfferPreview feature flag activated', async () => {
    render(
      reactQueryProviderHOC(
        <OfferContent
          offer={offerResponseSnap}
          searchGroupList={placeholderData.searchGroups}
          subcategory={mockSubcategory}
        />
      )
    )
    await waitFor(async () => {
      expect(screen.queryByTestId('imageTag')).not.toBeOnTheScreen()
    })
  })

  describe('When WIP_OFFER_PREVIEW feature flag activated and we are on a web', () => {
    beforeEach(() => {
      jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)
    })

    it('should not navigate to offer preview screen when clicking on image offer', async () => {
      render(
        reactQueryProviderHOC(
          <OfferContent
            offer={offerResponseSnap}
            searchGroupList={placeholderData.searchGroups}
            subcategory={mockSubcategory}
          />
        )
      )

      fireEvent.click(await screen.findByTestId('offerImageWithoutCarousel'))

      await waitFor(async () => {
        expect(navigate).not.toHaveBeenCalled()
      })
    })
  })
})
