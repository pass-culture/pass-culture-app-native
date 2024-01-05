import mockdate from 'mockdate'
import React from 'react'
import { Button, Linking, Platform, Share as NativeShare } from 'react-native'
import Share, { Social } from 'react-native-share'
import { ReactTestInstance } from 'react-test-renderer'

import { OfferResponse } from 'api/gen'
import { mockDigitalOffer, mockOffer } from 'features/bookOffer/fixtures/offer'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { HitOfferWithArtistAndEan } from 'features/offer/components/OfferPlaylist/api/fetchOffersByArtist'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { beneficiaryUser, nonBeneficiaryUser } from 'fixtures/user'
import {
  mockedAlgoliaOffersWithSameArtistResponse,
  mockedAlgoliaResponse,
  moreHitsForSimilarOffersPlaylist,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { analytics } from 'libs/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import {
  checkGeolocPermission,
  GeolocPermissionState,
  LocationWrapper,
  useLocation,
} from 'libs/location'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { requestGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import { SuggestedPlace } from 'libs/place/types'
import { Network } from 'libs/share/types'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

jest.mock('features/offer/api/useOffer')
jest.mock('libs/address/useFormatFullAddress')

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
const mockNativeShare = jest
  .spyOn(NativeShare, 'share')
  .mockResolvedValue({ action: NativeShare.sharedAction })

const mockUseAuthContext = jest.fn().mockReturnValue({ isLoggedIn: true, user: beneficiaryUser })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

const mockUseNetInfo = jest.fn().mockReturnValue({ isConnected: true, isInternetReachable: true })
jest.mock('libs/network/useNetInfo', () => ({
  useNetInfo: () => mockUseNetInfo(),
}))

const onScroll = jest.fn()
const handleChangeSameArtistPlaylistDisplay = jest.fn()

const offerId = mockOffer.id

const mockSearchHits: Offer[] = [...mockedAlgoliaResponse.hits, ...moreHitsForSimilarOffersPlaylist]

jest.useFakeTimers({ legacyFakeTimers: true })

const trigger = async (component: ReactTestInstance) => {
  fireEvent.press(component)

  // The Accessibility accordion is animated so we wait until its fully open before testing the analytics
  await act(async () => {
    jest.runAllTimers()
  })
}

jest.mock('libs/location/geolocation/getGeolocPosition/getGeolocPosition')
const mockGetGeolocPosition = getGeolocPosition as jest.MockedFunction<typeof getGeolocPosition>

jest.mock('libs/location/geolocation/requestGeolocPermission/requestGeolocPermission')
const mockRequestGeolocPermission = requestGeolocPermission as jest.MockedFunction<
  typeof requestGeolocPermission
>

jest.mock('libs/location/geolocation/checkGeolocPermission/checkGeolocPermission')
const mockCheckGeolocPermission = checkGeolocPermission as jest.MockedFunction<
  typeof checkGeolocPermission
>

describe('<OfferBody />', () => {
  beforeAll(() => {
    mockdate.set(new Date('2021-01-01'))
  })

  afterEach(() => {
    mockdate.reset()
  })

  it('should match snapshot for physical offer', async () => {
    renderOfferBody({})
    await screen.findByTestId('offer-container')

    expect(screen).toMatchSnapshot()
  })

  it('should match snapshot for digital offer', async () => {
    renderOfferBody({ offer: mockDigitalOffer })
    await screen.findByTestId('offer-container')

    expect(screen).toMatchSnapshot()
  })

  describe('share on social media', () => {
    it.each([true, false])(`should always display "Plus d’options" button`, async (hasSocial) => {
      canOpenURLSpy.mockResolvedValueOnce(hasSocial)
      renderOfferBody({})

      await waitFor(() => {
        expect(screen.queryByText('Plus d’options')).toBeOnTheScreen()
      })
    })

    it('should open social medium on share button press', async () => {
      canOpenURLSpy.mockResolvedValueOnce(true)
      renderOfferBody({})

      await act(async () => {
        const socialMediumButton = await screen.findByText(`Envoyer sur ${[Network.instagram]}`)
        fireEvent.press(socialMediumButton)
      })

      const expectedUrl = `${getOfferUrl(offerId, 'social_media')}&utm_source=${Network.instagram}`

      expect(mockShareSingle).toHaveBeenCalledWith({
        social: Social.Instagram,
        message: encodeURIComponent(
          `Retrouve "${mockOffer.name}" chez "${mockOffer.venue.name}" sur le pass Culture\u00a0:\n${expectedUrl}`
        ),
        type: 'text',
        url: undefined,
      })
    })

    it('should log when the user shares the offer on a certain medium', async () => {
      canOpenURLSpy.mockResolvedValueOnce(true)
      renderOfferBody({})

      const socialMediumButton = await screen.findByText(`Envoyer sur ${[Network.instagram]}`)
      fireEvent.press(socialMediumButton)

      expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
        type: 'Offer',
        from: 'offer',
        offerId,
        social: Network.instagram,
      })
    })

    it('should log when the user press "Plus d’options" share button', async () => {
      renderOfferBody({})

      const otherButton = await screen.findByText('Plus d’options')
      await act(async () => fireEvent.press(otherButton))

      expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
        type: 'Offer',
        from: 'offer',
        offerId,
        social: 'Other',
      })
    })

    describe('on Android', () => {
      beforeAll(() => (Platform.OS = 'android'))

      afterAll(() => (Platform.OS = 'ios'))

      it('should open social medium on share button press using correct message', async () => {
        // FIXME(PC-21174): This warning comes from android 'Expected style "elevation: 16px" to be unitless' due to shadow style
        jest.spyOn(global.console, 'warn').mockImplementationOnce(() => null)
        canOpenURLSpy.mockResolvedValueOnce(true)
        renderOfferBody({})

        await act(async () => {
          const socialMediumButton = await screen.findByText(`Envoyer sur ${[Network.instagram]}`)
          fireEvent.press(socialMediumButton)
        })

        const expectedUrl = `${getOfferUrl(offerId, 'social_media')}&utm_source=${
          Network.instagram
        }`

        expect(mockShareSingle).toHaveBeenCalledWith({
          social: Social.Instagram,
          message: encodeURIComponent(
            `Retrouve "${mockOffer.name}" chez "${mockOffer.venue.name}" sur le pass Culture\u00a0:\n${expectedUrl}`
          ),
          type: 'text',
          url: undefined,
        })
      })
    })

    it('should open native share modal on "Plus d’options" press', async () => {
      renderOfferBody({})

      await act(async () => {
        const otherButton = screen.getByText('Plus d’options')
        fireEvent.press(otherButton)
      })

      expect(mockNativeShare).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility details', () => {
    it('should not display accessibility when disabilities are not defined', async () => {
      renderOfferBody({})
      await screen.findByTestId('offer-container')

      expect(screen.queryByText('Accessibilité')).not.toBeOnTheScreen()
    })

    it('should display accessibility when disabilities are defined', async () => {
      renderOfferBody({
        offer: { ...mockOffer, accessibility: { visualDisability: false, audioDisability: false } },
      })

      expect(await screen.findByText('Accessibilité')).toBeTruthy()
    })

    it('should log that the user has open accessibility modalities only once', async () => {
      renderOfferBody({
        offer: {
          ...mockOffer,
          accessibility: {
            audioDisability: true,
            mentalDisability: true,
            motorDisability: false,
            visualDisability: false,
          },
        },
      })

      const accessibilityButton = await screen.findByText('Accessibilité')
      await trigger(accessibilityButton)

      expect(analytics.logConsultAccessibility).toHaveBeenNthCalledWith(1, {
        offerId: mockOffer.id,
      })

      await trigger(accessibilityButton)

      expect(analytics.logConsultAccessibility).toHaveBeenCalledTimes(1)
    })
  })

  describe('withdrawalDetails', () => {
    it('should display withdrawal details for beneficiary user', async () => {
      renderOfferBody({ offer: { ...mockOffer, withdrawalDetails: 'How to withdraw' } })

      expect(await screen.findByText('Modalités de retrait')).toBeTruthy()
    })

    it('should not display withdrawal details for non beneficiary user', async () => {
      mockUseAuthContext.mockReturnValueOnce({ isLoggedIn: true, user: nonBeneficiaryUser })
      renderOfferBody({ offer: { ...mockOffer, withdrawalDetails: 'How to withdraw' } })
      await screen.findByTestId('offer-container')

      expect(screen.queryByText('Modalités de retrait')).not.toBeOnTheScreen()
    })

    it('should not display withdrawal details when not specified', async () => {
      renderOfferBody({})
      await screen.findByTestId('offer-container')

      expect(screen.queryByText('Modalités de retrait')).not.toBeOnTheScreen()
    })

    it('should log that the user has open withdrawal modalities only once', async () => {
      renderOfferBody({
        offer: { ...mockOffer, withdrawalDetails: 'How to withdraw, https://test.com' },
      })

      const withdrawalButton = await screen.findByText('Modalités de retrait')

      await trigger(withdrawalButton)

      expect(analytics.logConsultWithdrawal).toHaveBeenNthCalledWith(1, {
        offerId: mockOffer.id,
      })

      await trigger(withdrawalButton)

      expect(analytics.logConsultWithdrawal).toHaveBeenCalledTimes(1)
    })
  })

  it('should log when the user has seen the offer after unmount', async () => {
    renderOfferBody({})
    await screen.findByTestId('offer-container')

    expect(analytics.logOfferSeenDuration).not.toHaveBeenCalled()

    screen.unmount()

    expect(analytics.logOfferSeenDuration).toHaveBeenCalledTimes(1)
  })

  it('should log when the user scrolls same categories playlist', async () => {
    const nativeEventMiddle = {
      layoutMeasurement: { height: 296 },
      contentOffset: { x: 200 }, // how far did we scroll
      contentSize: { height: 296 },
    }
    renderOfferBody({
      additionalProps: {
        sameCategorySimilarOffers: mockSearchHits,
      },
    })

    const scrollView = (await screen.findAllByTestId('offersModuleList'))[0]

    await act(async () => {
      scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
    })

    expect(analytics.logPlaylistHorizontalScroll).toHaveBeenCalledTimes(1)
  })

  it('should log when the user scrolls other categories playlist', async () => {
    const nativeEventMiddle = {
      layoutMeasurement: { height: 296, width: 296 },
      contentOffset: { x: 200 }, // how far did we scroll
      contentSize: { height: 296, width: 296 },
    }
    renderOfferBody({
      additionalProps: {
        otherCategoriesSimilarOffers: mockSearchHits,
      },
    })
    const scrollView = (await screen.findAllByTestId('offersModuleList'))[0]

    await act(async () => {
      scrollView.props.onScroll({ nativeEvent: nativeEventMiddle })
    })

    expect(analytics.logPlaylistHorizontalScroll).toHaveBeenCalledTimes(1)
  })

  describe('if a place is selected, offers on the same author playlist', () => {
    beforeAll(() => {
      jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)
    })

    it('should have a relative distance to the selected place', async () => {
      renderOfferBodyDummyComponent({
        additionalProps: {
          otherCategoriesSimilarOffers: mockSearchHits,
          sameArtistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
        },
      })
      const setPlaceButton = screen.getByText('setPlace')

      await act(async () => {
        fireEvent.press(setPlaceButton)
      })

      screen.getByText('Du même auteur')
      const distanceBetweenParisAndVannes = '397 km'

      expect(screen.getByText(distanceBetweenParisAndVannes)).toBeOnTheScreen()
    })

    it('should have a relative distance to the selected place and not the geolocposition even if geolocated', async () => {
      mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
      mockRequestGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
      mockGetGeolocPosition.mockResolvedValueOnce({ latitude: 0, longitude: 0 })

      renderOfferBodyDummyComponent({
        additionalProps: {
          otherCategoriesSimilarOffers: mockSearchHits,
          sameArtistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
        },
      })
      const setPlaceButton = screen.getByText('setPlace')

      await act(async () => {
        fireEvent.press(setPlaceButton)
      })
      screen.getByText('Du même auteur')
      const distanceBetweenParisAndVannes = '397 km'

      expect(screen.getByText(distanceBetweenParisAndVannes)).toBeOnTheScreen()
    })
  })
})

type AdditionalProps = {
  sameCategorySimilarOffers?: Offer[]
  otherCategoriesSimilarOffers?: Offer[]
  sameArtistPlaylist?: HitOfferWithArtistAndEan[]
}

type RenderOfferBodyProps = {
  offer?: OfferResponse
  additionalProps?: AdditionalProps
}

const renderOfferBody = ({ offer = mockOffer, additionalProps = {} }: RenderOfferBodyProps) =>
  render(
    reactQueryProviderHOC(
      <OfferBody
        offer={offer}
        onScroll={onScroll}
        handleChangeSameArtistPlaylistDisplay={handleChangeSameArtistPlaylistDisplay}
        {...additionalProps}
      />
    )
  )

const renderOfferBodyDummyComponent = ({
  offer = mockOffer,
  additionalProps = {},
}: RenderOfferBodyProps) =>
  render(
    reactQueryProviderHOC(
      <LocationWrapper>
        <DummyComponent offer={offer} additionalProps={additionalProps} />
      </LocationWrapper>
    )
  )

const DummyComponent = ({ offer = mockOffer, additionalProps = {} }: RenderOfferBodyProps) => {
  const { setPlace } = useLocation()
  const mockPlaces: SuggestedPlace[] = [
    {
      label: 'Paris',
      info: 'Ile de france',
      geolocation: { longitude: 2.3522219, latitude: 48.856614 },
    },
  ]

  return (
    <React.Fragment>
      <Button title="setPlace" onPress={() => setPlace(mockPlaces[0])} />
      <OfferBody
        offer={offer}
        onScroll={onScroll}
        handleChangeSameArtistPlaylistDisplay={handleChangeSameArtistPlaylistDisplay}
        {...additionalProps}
      />
    </React.Fragment>
  )
}
