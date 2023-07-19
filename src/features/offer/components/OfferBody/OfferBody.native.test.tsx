import mockdate from 'mockdate'
import React from 'react'
import { Linking, Share as NativeShare } from 'react-native'
import Share, { Social } from 'react-native-share'
import { UseQueryResult } from 'react-query'

import { push } from '__mocks__/@react-navigation/native'
import { navigate } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { SubcategoryIdEnum, UserReportedOffersResponse } from 'api/gen'
import { mockDigitalOffer, mockOffer } from 'features/bookOffer/fixtures/offer'
import * as ReportedOffersAPI from 'features/offer/api/useReportedOffers'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import {
  mockedAlgoliaResponse,
  moreHitsForSimilarOffersPlaylist,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { NetInfoWrapper } from 'libs/network/NetInfoWrapper'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'
import { Network } from 'ui/components/ShareMessagingApp'

jest.mock('api/api')
jest.unmock('libs/network/NetInfoWrapper')
jest.mock('shared/user/useAvailableCredit')
jest.mock('features/auth/context/AuthContext')
jest.mock('features/offer/api/useOffer')
jest.mock('features/offer/helpers/useTrackOfferSeenDuration')
jest.mock('libs/address/useFormatFullAddress')
jest.mock('features/offer/helpers/useReasonsForReporting/useReasonsForReporting', () => ({
  useReasonsForReporting: jest.fn(() => ({
    data: {
      reasons: {
        IMPROPER: {
          description: 'La date ne correspond pas, mauvaise description...',
          title: 'La description est non conforme',
        },
        INAPPROPRIATE: {
          description: 'violence, incitation à la haine, nudité...',
          title: 'Le contenu est inapproprié',
        },
        OTHER: {
          description: '',
          title: 'Autre',
        },
        PRICE_TOO_HIGH: {
          description: 'comparé à l’offre public',
          title: 'Le tarif est trop élevé',
        },
      },
    },
  })),
}))
let mockSearchHits: Offer[] = []
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

const canOpenURLSpy = jest.spyOn(Linking, 'canOpenURL')
const mockShareSingle = jest.spyOn(Share, 'shareSingle')
const mockNativeShare = jest.spyOn(NativeShare, 'share')

const mockUseOffer = jest.fn().mockReturnValue({ data: mockOffer })
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => mockUseOffer(),
}))

const mockUseAuthContext = jest.fn().mockReturnValue({ isLoggedIn: true, user: beneficiaryUser })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

const useReportedOffersMock = jest.spyOn(ReportedOffersAPI, 'useReportedOffers')

const mockUseNetInfo = jest.fn().mockReturnValue({ isConnected: true, isInternetReachable: true })
jest.mock('libs/network/useNetInfo', () => ({
  useNetInfo: () => mockUseNetInfo(),
}))

const offerVenues = [
  {
    title: 'Envie de lire',
    address: '94200 Ivry-sur-Seine, 16 rue Gabriel Peri',
    distance: '500 m',
    offerId: 1,
    price: 1000,
  },
  {
    title: 'Le Livre Éclaire',
    address: '75013 Paris, 56 rue de Tolbiac',
    distance: '1,5 km',
    offerId: 2,
    price: 1000,
  },
  {
    title: 'Hachette Livre',
    address: '94200 Ivry-sur-Seine, Rue Charles du Colomb',
    distance: '2,4 km',
    offerId: 3,
    price: 1000,
  },
]
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
const mockData = {
  pages: [
    {
      nbHits: 0,
      hits: [],
      page: 0,
    },
  ],
}
let mockVenueList: VenueListItem[] = []
let mockNbVenueItems = 0
jest.mock('api/useSearchVenuesOffer/useSearchVenueOffers', () => ({
  useSearchVenueOffers: () => ({
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    data: mockData,
    venueList: mockVenueList,
    nbVenueItems: mockNbVenueItems,
    isFetching: false,
  }),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

const onScroll = jest.fn()

const offerId = mockOffer.id

describe('<OfferBody />', () => {
  beforeAll(() => {
    mockdate.set(new Date('2021-01-01'))
    mockVenueList = []
    mockNbVenueItems = 0
  })

  afterEach(() => {
    mockVenueList = []
    mockNbVenueItems = 0
  })

  it('should match snapshot for physical offer', async () => {
    renderOfferBody()
    await screen.findByTestId('offer-container')

    expect(screen).toMatchSnapshot()
  })

  it('should match snapshot for digital offer', async () => {
    // Mock useReportedOffer to avoid re-render
    useReportedOffersMock.mockReturnValueOnce({
      data: { reportedOffers: [] },
    } as unknown as UseQueryResult<UserReportedOffersResponse>)
    mockUseOffer.mockReturnValueOnce({ data: mockDigitalOffer })
    renderOfferBody()
    await screen.findByTestId('offer-container')

    expect(screen).toMatchSnapshot()
  })

  it('should show venue banner in where section', async () => {
    renderOfferBody()

    expect(await screen.findByTestId(`Lieu ${mockOffer.venue.name}`)).toBeTruthy()
  })

  describe('similar offers', () => {
    beforeAll(() => {
      mockSearchHits = [...mockedAlgoliaResponse.hits, ...moreHitsForSimilarOffersPlaylist]
    })

    it('should not display similar offers lists when offer has not it', async () => {
      renderOfferBody()

      await screen.findByText('Envoyer sur Instagram')

      expect(screen.queryByTestId('sameCategorySimilarOffers')).toBeFalsy()
      expect(screen.queryByTestId('otherCategoriesSimilarOffers')).toBeFalsy()
    })

    it('should display similar offers list when offer has some', async () => {
      renderOfferBody({
        sameCategorySimilarOffers: mockSearchHits,
        otherCategoriesSimilarOffers: mockSearchHits,
      })

      await screen.findByText('Envoyer sur Instagram')

      expect(screen.queryByTestId('sameCategorySimilarOffers')).toBeTruthy()
      expect(screen.queryByTestId('otherCategoriesSimilarOffers')).toBeTruthy()
    })

    describe('Same category similar offers', () => {
      it('should navigate to an offer when pressing on it', async () => {
        renderOfferBody({
          sameCategorySimilarOffers: mockSearchHits,
        })

        await screen.findByText('Envoyer sur Instagram')

        await fireEvent.press(screen.queryAllByText('La nuit des temps')[0])
        expect(push).toHaveBeenCalledWith('Offer', {
          from: 'offer',
          fromOfferId: offerId,
          id: 102280,
        })
      })
    })

    describe('Other categories differents from that of the offer', () => {
      it('should navigate to an offer when pressing on it', async () => {
        renderOfferBody({
          otherCategoriesSimilarOffers: mockSearchHits,
        })

        await screen.findByText('Envoyer sur Instagram')

        await fireEvent.press(screen.queryAllByText('La nuit des temps')[0])
        expect(push).toHaveBeenCalledWith('Offer', {
          from: 'offer',
          fromOfferId: offerId,
          id: 102280,
        })
      })
    })
  })

  describe('share on social media', () => {
    it.each([true, false])(`should always display "Plus d’options" button`, async (hasSocial) => {
      canOpenURLSpy.mockResolvedValueOnce(hasSocial)
      renderOfferBody()

      await waitFor(() => {
        expect(screen.queryByText('Plus d’options')).toBeTruthy()
      })
    })

    it('should open social medium on share button press', async () => {
      canOpenURLSpy.mockResolvedValueOnce(true)
      renderOfferBody()

      await act(async () => {
        const socialMediumButton = await screen.findByText(`Envoyer sur ${[Network.instagram]}`)
        fireEvent.press(socialMediumButton)
      })

      expect(mockShareSingle).toHaveBeenCalledWith({
        social: Social.Instagram,
        message: encodeURI(
          `Retrouve "${mockOffer.name}" chez "${
            mockOffer.venue.name
          }" sur le pass Culture\n${getOfferUrl(offerId)}`
        ),
        type: 'text',
        url: undefined,
      })
    })

    it('should open native share modal on "Plus d’options" press', async () => {
      renderOfferBody()

      await act(async () => {
        const otherButton = screen.getByText('Plus d’options')
        fireEvent.press(otherButton)
      })

      expect(mockNativeShare).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility details', () => {
    it('should not display accessibility when disabilities are not defined', async () => {
      renderOfferBody()
      await screen.findByTestId('offer-container')

      expect(screen.queryByText('Accessibilité')).toBeNull()
    })

    it('should display accessibility when disabilities are defined', async () => {
      mockUseOffer.mockReturnValueOnce({
        data: { ...mockOffer, accessibility: { visualDisability: false, audioDisability: false } },
      })
      renderOfferBody()

      expect(await screen.findByText('Accessibilité')).toBeTruthy()
    })
  })

  describe('withdrawalDetails', () => {
    it('should display withdrawal details for beneficiary user', async () => {
      mockUseOffer.mockReturnValueOnce({
        data: { ...mockOffer, withdrawalDetails: 'How to withdraw' },
      })
      renderOfferBody()

      expect(await screen.findByText('Modalités de retrait')).toBeTruthy()
    })

    it('should not display withdrawal details for non beneficiary user', async () => {
      mockUseOffer.mockReturnValueOnce({
        data: { ...mockOffer, withdrawalDetails: 'How to withdraw' },
      })
      mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true, user: nonBeneficiaryUser })
      renderOfferBody()
      await screen.findByTestId('offer-container')

      expect(screen.queryByText('Modalités de retrait')).toBeNull()
    })

    it('should not display withdrawal details when not specified', async () => {
      renderOfferBody()
      await screen.findByTestId('offer-container')

      expect(screen.queryByText('Modalités de retrait')).toBeNull()
    })
  })

  it('should not display distance when no address and go to button', async () => {
    // Mock useReportedOffer to avoid re-render
    useReportedOffersMock.mockReturnValueOnce({
      data: { reportedOffers: [] },
    } as unknown as UseQueryResult<UserReportedOffersResponse>)
    const venueWithoutAddress = {
      id: 1,
      offerer: { name: 'PATHE BEAUGRENELLE' },
      name: 'PATHE BEAUGRENELLE',
      coordinates: {},
      isPermanent: true,
    }
    mockUseOffer.mockReturnValueOnce({
      data: {
        ...mockOffer,
        venue: venueWithoutAddress,
      },
    })
    renderOfferBody()

    await screen.findByTestId('offer-container')

    expect(screen.queryByText('Voir l’itinéraire')).toBeNull()
    expect(screen.queryByText('Distance')).toBeNull()
  })

  describe('report offer', () => {
    it("should open the report modal upon clicking on 'signaler l'offre'", async () => {
      renderOfferBody()

      const reportOfferButton = await screen.findByTestId('Signaler l’offre')

      fireEvent.press(reportOfferButton)
      expect(screen).toMatchSnapshot()
    })

    it('should request /native/v1/offers/reports if user is logged in and connected', async () => {
      renderOfferBody()

      await waitFor(() => {
        expect(api.getnativev1offersreports).toHaveBeenCalledTimes(1)
      })
    })

    it('should not request /native/v1/offers/reports if user is logged in and not connected', async () => {
      mockUseNetInfo.mockReturnValueOnce({
        isConnected: false,
        isInternetReachable: false,
      })
      renderOfferBody()
      await screen.findByTestId('offer-container')

      expect(api.getnativev1offersreports).not.toHaveBeenCalled()
    })

    it('should not request /native/v1/offers/reports if user is not logged in and connected', async () => {
      mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: false, user: undefined }) // First mock for call in OfferBody
      mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: false, user: undefined }) // Second mock for call in useReportedOffers
      renderOfferBody()
      await screen.findByTestId('offer-container')

      expect(api.getnativev1offersreports).not.toBeCalled()
    })
  })

  describe('When wipEnableMultivenueOffer feature flag deactivated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(false)
      // Mock useReportedOffer to avoid re-render
      useReportedOffersMock.mockReturnValueOnce({
        data: { reportedOffers: [] },
      } as unknown as UseQueryResult<UserReportedOffersResponse>)
    })

    it('should not display other venues available button when offer subcategory is "Livres audio physiques" and offer has an EAN', async () => {
      mockUseOffer.mockReturnValueOnce({
        data: {
          ...mockOffer,
          subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
          extraData: { ean: '2765410054' },
        },
      })
      renderOfferBody()

      await screen.findByTestId('offer-container')
      expect(screen.queryByText('Voir d’autres lieux disponibles')).toBeNull()
    })

    it('should not display other venues available button when offer subcategory is "Livres papier" and offer has an EAN', async () => {
      mockUseOffer.mockReturnValueOnce({
        data: {
          ...mockOffer,
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
          extraData: { ean: '2765410054' },
        },
      })
      renderOfferBody()

      await screen.findByTestId('offer-container')
      expect(screen.queryByText('Voir d’autres lieux disponibles')).toBeNull()
    })

    it('should not display other venues available button when offer subcategory is not "Livres papier" or "Livres audio physiques"', async () => {
      renderOfferBody()

      await screen.findByTestId('offer-container')
      expect(screen.queryByText('Voir d’autres lieux disponibles')).toBeNull()
    })

    it('should display old venue section', async () => {
      renderOfferBody()

      await screen.findByTestId('offer-container')
      expect(screen.queryByText('Où\u00a0?')).toBeTruthy()
    })

    it('should not display new venue section', async () => {
      renderOfferBody()

      await screen.findByTestId('offer-container')
      expect(screen.queryByTestId('venueCard')).toBeNull()
      expect(screen.queryByTestId('venueInfos')).toBeNull()
    })
  })

  describe('When wipEnableMultivenueOffer feature flag activated', () => {
    beforeEach(() => {
      useFeatureFlagSpy.mockReturnValueOnce(true)
      // Mock useReportedOffer to avoid re-render
      useReportedOffersMock.mockReturnValueOnce({
        data: { reportedOffers: [] },
      } as unknown as UseQueryResult<UserReportedOffersResponse>)
    })

    it('should display other venues available button when offer subcategory is "Livres audio physiques", offer has an EAN and that there are other venues offering the same offer', async () => {
      mockUseOffer.mockReturnValueOnce({
        data: {
          ...mockOffer,
          subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
          extraData: { ean: '2765410054' },
        },
      })
      mockNbVenueItems = 2
      mockVenueList = offerVenues
      renderOfferBody()

      await screen.findByTestId('offer-container')
      expect(screen.getByText('Voir d’autres lieux disponibles')).toBeTruthy()
    })

    it('should not display other venues available button when offer subcategory is "Livres audio physiques", offer has an EAN and that there are not other venues offering the same offer', async () => {
      mockUseOffer.mockReturnValueOnce({
        data: {
          ...mockOffer,
          subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE,
          extraData: { ean: '2765410054' },
        },
      })
      mockNbVenueItems = 0
      mockVenueList = []
      renderOfferBody()

      await screen.findByTestId('offer-container')
      expect(screen.queryByText('Voir d’autres lieux disponibles')).toBeNull()
    })

    it('should not display other venues available button when offer subcategory is "Livres audio physiques" and offer has not an EAN', async () => {
      mockUseOffer.mockReturnValueOnce({
        data: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_AUDIO_PHYSIQUE },
      })
      renderOfferBody()

      await screen.findByTestId('offer-container')
      expect(screen.queryByText('Voir d’autres lieux disponibles')).toBeNull()
    })

    it('should display other venues available button when offer subcategory is "Livres papier", offer has an EAN  and that there are other venues offering the same offer', async () => {
      mockUseOffer.mockReturnValueOnce({
        data: {
          ...mockOffer,
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
          extraData: { ean: '2765410054' },
        },
      })
      mockNbVenueItems = 2
      mockVenueList = offerVenues
      renderOfferBody()

      await screen.findByTestId('offer-container')
      expect(screen.getByText('Voir d’autres lieux disponibles')).toBeTruthy()
    })

    it('should not display other venues available button when offer subcategory is "Livres papier", offer has an EAN  and that there are other venues offering the same offer', async () => {
      mockUseOffer.mockReturnValueOnce({
        data: {
          ...mockOffer,
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
          extraData: { ean: '2765410054' },
        },
      })
      mockNbVenueItems = 0
      mockVenueList = []
      renderOfferBody()

      await screen.findByTestId('offer-container')
      expect(screen.queryByText('Voir d’autres lieux disponibles')).toBeNull()
    })

    it('should not display other venues available button when offer subcategory is "Livres papier" and offer has not an EAN', async () => {
      mockUseOffer.mockReturnValueOnce({
        data: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
      })
      mockNbVenueItems = 2
      mockVenueList = offerVenues
      renderOfferBody()

      await screen.findByTestId('offer-container')
      expect(screen.queryByText('Voir d’autres lieux disponibles')).toBeNull()
    })

    it('should not display other venues available button when offer subcategory is not "Livres papier" or "Livres audio physiques"', async () => {
      renderOfferBody()

      await screen.findByTestId('offer-container')
      expect(screen.queryByText('Voir d’autres lieux disponibles')).toBeNull()
    })

    it('should not display old venue section', async () => {
      renderOfferBody()

      await screen.findByTestId('offer-container')
      expect(screen.queryByText('Où\u00a0?')).toBeNull()
    })

    describe('should display new venue section', () => {
      it('With "Lieu de retrait" in title by default', async () => {
        mockUseOffer.mockReturnValueOnce({
          data: { ...mockOffer, subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER },
        })
        renderOfferBody()

        await screen.findByTestId('offer-container')
        expect(screen.queryByText('Lieu de retrait')).toBeTruthy()
      })

      it('With "Lieu de l’événement" in title when event offer', async () => {
        mockUseOffer.mockReturnValueOnce({
          data: { ...mockOffer, subcategoryId: SubcategoryIdEnum.CONCERT },
        })
        renderOfferBody()

        await screen.findByTestId('offer-container')
        expect(screen.queryByText('Lieu de l’événement')).toBeTruthy()
      })

      it('With "Lieu de projection" in title when offer subcategory is "Séances de cinéma"', async () => {
        mockUseOffer.mockReturnValueOnce({
          data: { ...mockOffer, subcategoryId: SubcategoryIdEnum.SEANCE_CINE },
        })
        renderOfferBody()

        await screen.findByTestId('offer-container')
        expect(screen.queryByText('Lieu de projection')).toBeTruthy()
      })
    })

    it('should navigate to an other offer when user choose an other venue from "Voir d’autres lieux disponibles" button', async () => {
      const mockShowModal = jest.fn()
      jest.spyOn(useModalAPI, 'useModal').mockReturnValueOnce({
        visible: true,
        showModal: mockShowModal,
        hideModal: jest.fn(),
        toggleModal: jest.fn(),
      })
      mockUseOffer.mockReturnValueOnce({
        data: {
          ...mockOffer,
          subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
          extraData: { ean: '2765410054' },
        },
      })
      mockNbVenueItems = 2
      mockVenueList = offerVenues

      renderOfferBody()

      await screen.findByTestId('offer-container')

      fireEvent.press(screen.getByText('Le Livre Éclaire'))
      fireEvent.press(screen.getByText('Choisir ce lieu'))

      expect(navigate).toHaveBeenCalledWith('Offer', {
        fromOfferId: offerId,
        id: 2,
        fromMultivenueOfferId: offerId,
      })
    })
  })
})

const renderOfferBody = (
  additionalProps: {
    sameCategorySimilarOffers?: Offer[]
    otherCategoriesSimilarOffers?: Offer[]
  } = {}
) =>
  render(
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    reactQueryProviderHOC(
      <NetInfoWrapper>
        <OfferBody offerId={offerId} onScroll={onScroll} {...additionalProps} />
      </NetInfoWrapper>
    )
  )
