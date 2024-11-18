import React, { ComponentProps } from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Position } from 'libs/location'
import { SuggestedPlace } from 'libs/place/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen, waitFor } from 'tests/utils/web'

import { OfferContent } from './OfferContent.web'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
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

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

type RenderOfferContentType = Partial<ComponentProps<typeof OfferContent>> & {
  isDesktopViewport?: boolean
}

function renderOfferContent({
  offer = offerResponseSnap,
  subcategory = mockSubcategory,
  isDesktopViewport = false,
}: RenderOfferContentType) {
  render(
    reactQueryProviderHOC(
      <OfferContent
        offer={offer}
        searchGroupList={PLACEHOLDER_DATA.searchGroups}
        subcategory={subcategory}
      />
    ),
    {
      theme: { isDesktopViewport },
    }
  )
}

describe('<OfferContent />', () => {
  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    mockPosition = { latitude: 90.4773245, longitude: 90.4773245 }
    mockAuthContextWithoutUser({ persist: true })
  })

  it('should not display sticky booking button on desktop', async () => {
    renderOfferContent({ isDesktopViewport: true })

    await screen.findByText('Réserver l’offre')

    expect(screen.queryByTestId('sticky-booking-button')).not.toBeInTheDocument()
  })

  it('should display sticky booking button on mobile', async () => {
    renderOfferContent({ isDesktopViewport: false })

    await screen.findByText('Réserver l’offre')

    expect(screen.getByTestId('sticky-booking-button')).toBeInTheDocument()
  })

  it('should not display mobile body on desktop', async () => {
    renderOfferContent({ isDesktopViewport: true })

    await screen.findByText('Réserver l’offre')

    expect(screen.queryByTestId('offer-body-mobile')).not.toBeInTheDocument()
  })

  it('should display mobile body on mobile', async () => {
    renderOfferContent({ isDesktopViewport: false })

    await screen.findByText('Réserver l’offre')

    expect(screen.getByTestId('offer-body-mobile')).toBeInTheDocument()
  })

  it('should display desktop body on desktop', async () => {
    renderOfferContent({ isDesktopViewport: true })
    await screen.findByText('Réserver l’offre')

    expect(await screen.findByTestId('offer-body-desktop')).toBeInTheDocument()
  })

  it('should display nonadhesive booking button on desktop', async () => {
    renderOfferContent({ isDesktopViewport: true })

    expect(await screen.findByTestId('booking-button')).toBeInTheDocument()
  })

  it('should not display linear gradient on offer image when enableOfferPreview feature flag activated', async () => {
    renderOfferContent({ isDesktopViewport: false })

    await waitFor(async () => {
      expect(screen.queryByTestId('imageGradient')).not.toBeInTheDocument()
    })
  })

  it('should not display tag on offer image when enableOfferPreview feature flag activated', async () => {
    renderOfferContent({ isDesktopViewport: false })

    await waitFor(async () => {
      expect(screen.queryByTestId('imageTag')).not.toBeInTheDocument()
    })
  })

  it('should not navigate to offer preview screen when clicking on image offer', async () => {
    renderOfferContent({ isDesktopViewport: false })

    fireEvent.click(await screen.findByTestId('offerImageWithoutCarousel'))

    await waitFor(async () => {
      expect(navigate).not.toHaveBeenCalled()
    })
  })
})
