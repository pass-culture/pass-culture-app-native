import * as ReactQueryAPI from '@tanstack/react-query'
import React, { ComponentProps } from 'react'

import { OfferResponseV2, SubcategoriesResponseModelv2 } from 'api/gen'
import { chronicleVariantInfoFixture } from 'features/offer/fixtures/chronicleVariantInfo'
import { mockSubcategory } from 'features/offer/fixtures/mockSubcategory'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as useSimilarOffersAPI from 'features/offer/queries/useSimilarOffersQuery'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Position } from 'libs/location/location'
import { SuggestedPlace } from 'libs/place/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils/web'
import * as useModalAPI from 'ui/components/modals/useModal'

import { OfferContent } from './OfferContent.web'

const mockShowModal = jest.fn()
jest.spyOn(useModalAPI, 'useModal').mockReturnValue({
  visible: false,
  showModal: mockShowModal,
  hideModal: jest.fn(),
  toggleModal: jest.fn(),
})

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

const useQueryClientSpy = jest.spyOn(ReactQueryAPI, 'useQueryClient')

useQueryClientSpy.mockReturnValue({
  getQueryData: () => ({ images: { recto: { url: 'image.jpeg' } } }),
} as unknown as ReactQueryAPI.QueryClient)

jest
  .spyOn(useSimilarOffersAPI, 'useSimilarOffersQuery')
  .mockReturnValue({ similarOffers: undefined, apiRecoParams: undefined })

jest.mock('features/auth/context/AuthContext')

jest.mock('libs/firebase/analytics/analytics')

describe('<OfferContent />', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    mockPosition = { latitude: 90.4773245, longitude: 90.4773245 }
    mockAuthContextWithoutUser({ persist: true })
  })

  it('should not display sticky booking button on desktop', async () => {
    const { unmount } = renderOfferContent({ isDesktopViewport: true })

    await screen.findByText('Réserver l’offre')

    expect(screen.queryByTestId('sticky-booking-button')).not.toBeInTheDocument()

    unmount()
  })

  it('should display sticky booking button on mobile', async () => {
    const { unmount } = renderOfferContent({ isDesktopViewport: false, isMobileViewport: true })
    await screen.findByText('Réserver l’offre')

    expect(screen.getByTestId('sticky-booking-button')).toBeInTheDocument()

    unmount()
  })

  it('should not display mobile body on desktop', async () => {
    const { unmount } = renderOfferContent({ isDesktopViewport: true })

    await screen.findByText('Réserver l’offre')

    expect(screen.queryByTestId('offer-body-mobile')).not.toBeInTheDocument()

    unmount()
  })

  it('should display mobile body on mobile', async () => {
    const { unmount } = renderOfferContent({ isDesktopViewport: false, isMobileViewport: true })

    await screen.findByText('Réserver l’offre')

    expect(screen.getByTestId('offer-body-mobile')).toBeInTheDocument()

    unmount()
  })

  it('should display desktop body on desktop', async () => {
    const { unmount } = renderOfferContent({ isDesktopViewport: true })
    await screen.findByText('Réserver l’offre')

    expect(await screen.findByTestId('offer-body-desktop')).toBeInTheDocument()

    unmount()
  })

  it('should display nonadhesive booking button on desktop', async () => {
    const { unmount } = renderOfferContent({ isDesktopViewport: true })

    await screen.findByText('Réserver l’offre')

    expect(await screen.findByTestId('booking-button')).toBeInTheDocument()

    unmount()
  })

  it('should display linear gradient on offer image', async () => {
    const { unmount } = renderOfferContent({ isDesktopViewport: false })

    expect(await screen.findByTestId('imageGradient')).toBeInTheDocument()

    unmount()
  })

  it('should not display tag on offer image when enableOfferPreview feature flag activated', async () => {
    const { unmount } = renderOfferContent({ isDesktopViewport: false })

    await waitFor(() => {
      expect(screen.queryByTestId('imageTag')).not.toBeInTheDocument()
    })
    unmount()
  })

  it('should not show preview modal when clicking on offer placeholder image', async () => {
    const offer: OfferResponseV2 = {
      ...offerResponseSnap,
      images: null,
    }
    const { unmount } = renderOfferContent({ offer })

    user.click(await screen.findByLabelText('Voir l’illustration en plein écran'))

    expect(mockShowModal).not.toHaveBeenCalled()

    unmount()
  })
})

type RenderOfferContentType = Partial<ComponentProps<typeof OfferContent>> & {
  isDesktopViewport?: boolean
  isMobileViewport?: boolean
}

const renderOfferContent = ({
  offer = offerResponseSnap,
  subcategory = mockSubcategory,
  isDesktopViewport = false,
  isMobileViewport = false,
}: RenderOfferContentType) => {
  return render(
    reactQueryProviderHOC(
      <OfferContent
        offer={offer}
        searchGroupList={PLACEHOLDER_DATA.searchGroups}
        subcategory={subcategory}
        chronicleVariantInfo={chronicleVariantInfoFixture}
        onShowChroniclesWritersModal={jest.fn()}
      />
    ),
    {
      theme: { isDesktopViewport, isMobileViewport },
    }
  )
}
