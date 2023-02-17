import mockdate from 'mockdate'
import React from 'react'
import { Share as NativeShare } from 'react-native'
import Share, { Social } from 'react-native-share'

import { push } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import * as useSimilarOffers from 'features/offer/api/useSimilarOffers'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { MAX_NB_OF_SOCIALS_TO_SHOW } from 'features/offer/components/shareMessagingOffer/InstalledMessagingApps'
import * as InstalledAppsCheck from 'features/offer/helpers/checkInstalledApps/checkInstalledApps'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { SearchHit } from 'libs/algolia'
import {
  mockedAlgoliaResponse,
  moreHitsForSimilarOffersPlaylist,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/firebase/analytics'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { act, cleanup, fireEvent, render, screen, waitFor } from 'tests/utils'
import { Network } from 'ui/components/ShareMessagingApp'

jest.mock('react-query')
jest.mock('shared/user/useAvailableCredit')
jest.mock('features/auth/context/AuthContext')
jest.mock('features/offer/api/useOffer')
jest.mock('features/offer/helpers/useTrackOfferSeenDuration')
jest.mock('libs/address/useFormatFullAddress')

let mockSearchHits: SearchHit[] = []
jest.mock('features/offer/api/useSimilarOffers', () => ({
  useSimilarOffers: jest.fn(() => mockSearchHits),
}))

const mockSubcategories = placeholderData.subcategories
const mockSearchGroups = placeholderData.searchGroups
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      searchGroups: mockSearchGroups,
    },
  }),
}))

const mockCheckInstalledApps = jest.spyOn(InstalledAppsCheck, 'checkInstalledApps') as jest.Mock
const mockShareSingle = jest.spyOn(Share, 'shareSingle')
const mockNativeShare = jest.spyOn(NativeShare, 'share')

describe('<OfferBody />', () => {
  beforeAll(() => {
    mockdate.set(new Date(2021, 0, 1))
  })
  afterEach(cleanup)

  const onScroll = jest.fn()

  const offerId = 1

  it("should open the report modal upon clicking on 'signaler l'offre'", async () => {
    render(<OfferBody offerId={offerId} onScroll={onScroll} />)

    const reportOfferButton = await screen.findByTestId('Signaler l’offre')

    fireEvent.press(reportOfferButton)
    expect(screen).toMatchSnapshot()
  })

  it('should log analytics event ConsultVenue when pressing on the venue banner', async () => {
    render(<OfferBody offerId={offerId} onScroll={onScroll} />)

    const venueBannerComponent = await screen.findByTestId(`Lieu ${mockOffer.venue.name}`)

    fireEvent.press(venueBannerComponent)
    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, { venueId: 2090, from: 'offer' })
  })

  it('should not display similar offers lists when offer has not it', async () => {
    render(<OfferBody offerId={offerId} onScroll={onScroll} />)

    expect(screen.queryByTestId('sameCategorySimilarOffers')).toBeFalsy()
    expect(screen.queryByTestId('otherCategoriesSimilarOffers')).toBeFalsy()
  })

  describe('with similar offers', () => {
    beforeAll(() => {
      mockSearchHits = [...mockedAlgoliaResponse.hits, ...moreHitsForSimilarOffersPlaylist]
    })

    it('should display similar offers list when offer has some', async () => {
      render(<OfferBody offerId={offerId} onScroll={onScroll} />)

      expect(screen.queryByTestId('sameCategorySimilarOffers')).toBeTruthy()
      expect(screen.queryByTestId('otherCategoriesSimilarOffers')).toBeTruthy()
    })

    it('should pass offer venue position to `useSimilarOffers`', () => {
      const spy = jest.spyOn(useSimilarOffers, 'useSimilarOffers').mockImplementationOnce(jest.fn())
      render(<OfferBody offerId={offerId} onScroll={onScroll} />)

      expect(spy).toHaveBeenNthCalledWith(1, {
        categoryIncluded: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
        offerId,
        position: mockOffer.venue.coordinates,
        shouldUseAlgoliaRecommend: false,
      })
      expect(spy).toHaveBeenNthCalledWith(2, {
        categoryExcluded: SearchGroupNameEnumv2.MUSEES_VISITES_CULTURELLES,
        offerId,
        position: mockOffer.venue.coordinates,
        shouldUseAlgoliaRecommend: false,
      })
    })

    describe('Same category similar offers', () => {
      it('should navigate to an offer when pressing on it', async () => {
        render(<OfferBody offerId={offerId} onScroll={onScroll} />)

        await fireEvent.press(screen.queryAllByText('La nuit des temps')[0])
        expect(push).toHaveBeenCalledWith('Offer', {
          from: 'offer',
          fromOfferId: 1,
          id: 102280,
        })
      })

      it('should log analytics event logSimilarOfferPlaylistHorizontalScroll when scrolling on it', async () => {
        const nativeEventMiddle = {
          layoutMeasurement: { height: 296 },
          contentOffset: { x: 200 }, // how far did we scroll
          contentSize: { height: 296 },
        }
        render(<OfferBody offerId={offerId} onScroll={onScroll} />)
        const scrollView = screen.queryAllByTestId('offersModuleList')[0]

        await waitFor(() => {
          scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
        })
        expect(analytics.logPlaylistHorizontalScroll).toHaveBeenCalledTimes(1)
      })
    })

    describe('Other categories differents from that of the offer', () => {
      it('should navigate to an offer when pressing on it', async () => {
        render(<OfferBody offerId={offerId} onScroll={onScroll} />)

        await fireEvent.press(screen.queryAllByText('La nuit des temps')[1])
        expect(push).toHaveBeenCalledWith('Offer', {
          from: 'offer',
          fromOfferId: 1,
          id: 102280,
        })
      })

      it('should log analytics event logPlaylistHorizontalScroll when scrolling on it', async () => {
        const nativeEventMiddle = {
          layoutMeasurement: { height: 296, width: 296 },
          contentOffset: { x: 200 }, // how far did we scroll
          contentSize: { height: 296, width: 296 },
        }
        render(<OfferBody offerId={offerId} onScroll={jest.fn()} />)
        const scrollView = screen.queryAllByTestId('offersModuleList')[1]

        await waitFor(() => {
          scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
        })
        expect(analytics.logPlaylistHorizontalScroll).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('share on social media', () => {
    it('should hide social medium when not installed', async () => {
      mockCheckInstalledApps.mockResolvedValueOnce({
        [Network.snapchat]: false,
      })
      render(<OfferBody offerId={offerId} onScroll={onScroll} />)

      await waitFor(() => {
        expect(screen.queryByText(`Envoyer sur ${[Network.snapchat]}`)).toBeFalsy()
      })
    })

    it('should display social medium when installed', async () => {
      mockCheckInstalledApps.mockResolvedValueOnce({
        [Network.snapchat]: true,
      })
      render(<OfferBody offerId={offerId} onScroll={onScroll} />)

      await waitFor(() => {
        expect(screen.queryByText(`Envoyer sur ${[Network.snapchat]}`)).toBeTruthy()
      })
    })

    it(`should not display more than ${MAX_NB_OF_SOCIALS_TO_SHOW} social media apps`, async () => {
      mockCheckInstalledApps.mockResolvedValueOnce({
        [Network.instagram]: true,
        [Network.snapchat]: true,
        [Network.whatsapp]: true,
        [Network.telegram]: true,
      })
      render(<OfferBody offerId={offerId} onScroll={onScroll} />)

      await waitFor(() => {
        expect(screen.queryAllByText(/Envoyer sur/)).toHaveLength(MAX_NB_OF_SOCIALS_TO_SHOW)
      })
    })

    it.each([true, false])(`should always display "Plus d’options" button`, async (hasSocial) => {
      mockCheckInstalledApps.mockResolvedValueOnce({
        [Network.snapchat]: hasSocial,
      })
      render(<OfferBody offerId={offerId} onScroll={onScroll} />)

      await waitFor(() => {
        expect(screen.queryByText('Plus d’options')).toBeTruthy()
      })
    })

    it('should open social medium on share button press', async () => {
      mockCheckInstalledApps.mockResolvedValueOnce({
        [Network.snapchat]: true,
      })
      render(<OfferBody offerId={offerId} onScroll={onScroll} />)

      await act(async () => {
        const socialMediumButton = await screen.findByText(`Envoyer sur ${[Network.snapchat]}`)
        fireEvent.press(socialMediumButton)
      })

      expect(mockShareSingle).toHaveBeenCalledWith({
        social: Social.Snapchat,
        message: `Retrouve "${mockOffer.name}" chez "${mockOffer.venue.name}" sur le pass Culture`,
        url: getOfferUrl(offerId),
      })
    })

    it('should open social medium on share button press with offer url even when web url is defined', async () => {
      mockCheckInstalledApps.mockResolvedValueOnce({
        [Network.whatsapp]: true,
      })
      render(<OfferBody offerId={offerId} onScroll={onScroll} />)

      await act(async () => {
        const socialMediumButton = await screen.findByText(`Envoyer sur ${[Network.whatsapp]}`)
        fireEvent.press(socialMediumButton)
      })

      expect(mockShareSingle).toHaveBeenCalledWith({
        social: Social.Whatsapp,
        message: `Retrouve "${mockOffer.name}" chez "${mockOffer.venue.name}" sur le pass Culture`,
        url: getOfferUrl(offerId),
      })
    })

    it('should open native share modal on "Plus d’options" press', async () => {
      mockCheckInstalledApps.mockResolvedValueOnce({
        [Network.snapchat]: true,
      })
      render(<OfferBody offerId={offerId} onScroll={onScroll} />)

      await act(async () => {
        const otherButton = screen.getByText('Plus d’options')
        fireEvent.press(otherButton)
      })

      expect(mockNativeShare).toHaveBeenCalledTimes(1)
    })
  })
})
