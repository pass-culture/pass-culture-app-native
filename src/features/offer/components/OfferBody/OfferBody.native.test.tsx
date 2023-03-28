import mockdate from 'mockdate'
import React from 'react'
import { Share as NativeShare } from 'react-native'
import Share, { Social } from 'react-native-share'
import { UseQueryResult } from 'react-query'

import { push } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { UserReportedOffersResponse } from 'api/gen'
import { mockDigitalOffer, mockOffer } from 'features/bookOffer/fixtures/offer'
import * as ReportedOffersAPI from 'features/offer/api/useReportedOffers'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { MAX_NB_OF_SOCIALS_TO_SHOW } from 'features/offer/components/shareMessagingOffer/InstalledMessagingApps'
import * as InstalledAppsCheck from 'features/offer/helpers/checkInstalledApps/checkInstalledApps'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import { SearchHit } from 'libs/algolia'
import {
  mockedAlgoliaResponse,
  moreHitsForSimilarOffersPlaylist,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { NetInfoWrapper } from 'libs/network/NetInfoWrapper'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
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

const onScroll = jest.fn()

const offerId = 1

describe('<OfferBody />', () => {
  beforeAll(() => {
    mockdate.set(new Date(2021, 0, 1))
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
          fromOfferId: 1,
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
          fromOfferId: 1,
          id: 102280,
        })
      })
    })
  })

  describe('share on social media', () => {
    it('should hide social medium when not installed', async () => {
      mockCheckInstalledApps.mockResolvedValueOnce({
        [Network.snapchat]: false,
      })
      renderOfferBody()

      await waitFor(() => {
        expect(screen.queryByText(`Envoyer sur ${[Network.snapchat]}`)).toBeFalsy()
      })
    })

    it('should display social medium when installed', async () => {
      mockCheckInstalledApps.mockResolvedValueOnce({
        [Network.snapchat]: true,
      })
      renderOfferBody()

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
      renderOfferBody()

      await waitFor(() => {
        expect(screen.queryAllByText(/Envoyer sur/)).toHaveLength(MAX_NB_OF_SOCIALS_TO_SHOW)
      })
    })

    it.each([true, false])(`should always display "Plus d’options" button`, async (hasSocial) => {
      mockCheckInstalledApps.mockResolvedValueOnce({
        [Network.snapchat]: hasSocial,
      })
      renderOfferBody()

      await waitFor(() => {
        expect(screen.queryByText('Plus d’options')).toBeTruthy()
      })
    })

    it('should open social medium on share button press', async () => {
      mockCheckInstalledApps.mockResolvedValueOnce({
        [Network.snapchat]: true,
      })
      renderOfferBody()

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
      renderOfferBody()

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
      renderOfferBody()

      await act(async () => {
        const otherButton = screen.getByText('Plus d’options')
        fireEvent.press(otherButton)
      })

      expect(mockNativeShare).toHaveBeenCalledTimes(1)
    })
  })
})

describe('<OfferBody /> deprecated', () => {
  beforeAll(() => {
    mockdate.set(new Date(2021, 0, 1))
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

    it('should not display withdrawal details when undefined', async () => {
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
})

export const renderOfferBody = (
  additionalProps: {
    sameCategorySimilarOffers?: SearchHit[]
    otherCategoriesSimilarOffers?: SearchHit[]
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
