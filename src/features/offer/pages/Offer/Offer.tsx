import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'

import { OfferArtist, ReactionTypeEnum } from 'api/gen'
import { AdvicesWritersModal } from 'features/advices/pages/AdvicesWritersModal/AdvicesWritersModal'
import { useOfferProAdvicesQuery } from 'features/advices/queries/useOfferProAdvicesQuery'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { clubAdviceVariant } from 'features/clubAdvices/helpers/clubAdviceVariant'
import { ConsentState, CookieNameEnum } from 'features/cookies/enums'
import { useCookies } from 'features/cookies/helpers/useCookies'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { advicePreviewToAdviceCardData } from 'features/offer/adapters/advicePreviewToAdviceCardData'
import { OfferContent } from 'features/offer/components/OfferContent/OfferContent'
import { OfferContentPlaceholder } from 'features/offer/components/OfferContentPlaceholder/OfferContentPlaceholder'
import { OfferArtistsModal } from 'features/offer/pages/OfferArtistsModal/OfferArtistsModal'
import { useFetchHeadlineOffersCountQuery } from 'features/offer/queries/useFetchHeadlineOffersCountQuery'
import { offerProAdvicesToAdviceCardData } from 'features/proAdvices/adapters/offerProAdvicesToAdviceCardData/offerProAdvicesToAdviceCardData'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { useReactionMutation } from 'features/reactions/queries/useReactionMutation'
import { analytics } from 'libs/analytics/provider'
import { formatToSlashedFrenchDate } from 'libs/dates'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useLocation } from 'libs/location/LocationWrapper'
import { useSubcategoriesMapping } from 'libs/subcategories/mappings'
import { useEndedBookingFromOfferIdQueryV2 } from 'queries/bookings'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { useSubcategoriesQuery } from 'queries/subcategories/useSubcategoriesQuery'
import { isMultiVenueCompatibleOffer } from 'shared/multiVenueOffer/isMultiVenueCompatibleOffer'
import { runAfterInteractionsMobile } from 'shared/runAfterInteractionsMobile/runAfterInteractionsMobile'
import { useABSegment } from 'shared/useABSegment/useABSegment'
import { useModal } from 'ui/components/modals/useModal'
import { Page } from 'ui/pages/Page'

const ANIMATION_DURATION = 700

export function Offer() {
  const route = useRoute<UseRouteType<'Offer'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const offerId = route.params?.id

  const isMultiArtistsEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_MULTI_ARTISTS)
  const enableProAdvices = useFeatureFlag(RemoteStoreFeatureFlags.WIP_PRO_REVIEWS_OFFER)
  const proAdvicesSegment = useABSegment(['A', 'B'])
  const shouldDisplayProAdvices = enableProAdvices && proAdvicesSegment === 'A'

  const { isLoggedIn, user } = useAuthContext()
  const { userLocation } = useLocation()
  const { data: offer, isLoading } = useOfferQuery({
    offerId,
    select: (data) => ({
      ...data,
      reactionsCount: { likes: data.reactionsCount.likes },
    }),
  })
  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  const { data: subcategories } = useSubcategoriesQuery()
  const subcategoriesMapping = useSubcategoriesMapping()

  const { cookiesConsent, setCookiesConsent } = useCookies()

  const hasVideoCookiesConsent =
    cookiesConsent.state === ConsentState.HAS_CONSENT &&
    cookiesConsent.value.accepted.includes(CookieNameEnum.VIDEO_PLAYBACK)

  const {
    visible: reactionModalVisible,
    hideModal: hideReactionModal,
    showModal: showReactionModal,
  } = useModal(false)
  const {
    visible: chroniclesWritersModalVisible,
    hideModal: hideChroniclesWritersModal,
    showModal: showChroniclesWritersModal,
  } = useModal(false)
  const {
    visible: offerArtistsModalVisible,
    hideModal: hideOfferArtistsModal,
    showModal: showOfferArtistsModal,
  } = useModal(false)
  const { data: booking } = useEndedBookingFromOfferIdQueryV2(
    offer?.id ?? -1,
    isLoggedIn && !!offer?.id
  )
  const { mutate: saveReaction } = useReactionMutation()
  const categoryId = offer?.subcategoryId
    ? subcategoriesMapping[offer?.subcategoryId]?.categoryId
    : ''
  const [selectedArtists, setSelectedArtists] = useState<OfferArtist[]>([])

  const handleSaveReaction = useCallback(
    ({ offerId, reactionType }: { offerId: number; reactionType: ReactionTypeEnum }) => {
      saveReaction({ reactions: [{ offerId, reactionType }] })
      hideReactionModal()
    },
    [hideReactionModal, saveReaction]
  )

  const handleOnShowRecoButtonPress = () => {
    void analytics.logClickAllClubRecos({
      offerId: offerId.toString(),
      from: 'offer',
      categoryName: categoryId,
    })
    hideChroniclesWritersModal()
    runAfterInteractionsMobile(() => {
      navigate('ThematicHome', { homeId: '4mlVpAZySUZO6eHazWKZeV', from: 'chronicles' })
    })
  }

  const handleOnShowClubAdviceWritersModal = () => {
    void analytics.logClickWhatsClub({
      offerId: offerId.toString(),
      from: 'offer',
      categoryName: categoryId,
    })
    showChroniclesWritersModal()
  }

  const handleOnVideoConsentPress = () => {
    const currentConsent = cookiesConsent.value ?? { accepted: [], mandatory: [], refused: [] }

    void setCookiesConsent({
      ...currentConsent,
      accepted: [...currentConsent.accepted, CookieNameEnum.VIDEO_PLAYBACK],
    })
  }

  const handleShowOfferArtistsModal = useCallback(
    (artistsToDisplay: OfferArtist[]) => {
      setSelectedArtists(artistsToDisplay)
      showOfferArtistsModal()
    },
    [showOfferArtistsModal]
  )

  const { data } = useFetchHeadlineOffersCountQuery(offer)

  const { data: proAdvicesData } = useOfferProAdvicesQuery({
    offerId,
    enableProAdvices: shouldDisplayProAdvices,
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    select: ({ proAdvices, nbResults }) => ({
      list: offerProAdvicesToAdviceCardData(proAdvices.slice(0, 5), offerId),
      nbResults,
    }),
  })
  const proAdvices = shouldDisplayProAdvices ? proAdvicesData : undefined

  if (!offer || !subcategories || !subcategoriesMapping?.[offer?.subcategoryId]) return null

  const subcategory = subcategoriesMapping[offer?.subcategoryId]
  const adviceVariantInfo = clubAdviceVariant[subcategory.id]
  const hasClubAdviceVariant = !!adviceVariantInfo

  const clubAdvices = hasClubAdviceVariant
    ? offer?.chronicles?.map((value) =>
        advicePreviewToAdviceCardData(value, adviceVariantInfo.subtitleItem)
      )
    : undefined

  const shouldFetchSearchVenueOffers = isMultiVenueCompatibleOffer(offer)
  const headlineOffersCount = shouldFetchSearchVenueOffers ? data?.headlineOffersCount : undefined

  if (showSkeleton) return <OfferContentPlaceholder />

  return (
    <Page>
      <View>
        <ReactionChoiceModal
          dateUsed={formatToSlashedFrenchDate(booking?.dateUsed ?? '')}
          offerId={offer.id}
          offerName={offer.name}
          imageUrl={offer.images?.url?.url}
          subcategoryId={offer.subcategoryId}
          closeModal={hideReactionModal}
          visible={reactionModalVisible}
          defaultReaction={booking?.userReaction}
          onSave={handleSaveReaction}
          from={ReactionFromEnum.ENDED_BOOKING}
          bodyType={ReactionChoiceModalBodyEnum.VALIDATION}
        />

        {hasClubAdviceVariant ? (
          <AdvicesWritersModal
            closeModal={hideChroniclesWritersModal}
            isVisible={chroniclesWritersModalVisible}
            onButtonPress={handleOnShowRecoButtonPress}
            modalWording={adviceVariantInfo.modalWording}
            buttonWording={adviceVariantInfo.buttonWording}
          />
        ) : null}
        {selectedArtists.length > 1 ? (
          <OfferArtistsModal
            isVisible={offerArtistsModalVisible}
            closeModal={hideOfferArtistsModal}
            artists={selectedArtists}
            navigateTo={{ screen: 'Artist' }}
            offerId={offer.id}
          />
        ) : null}
      </View>

      <OfferContent
        offer={offer}
        clubAdvices={clubAdvices}
        proAdvices={proAdvices?.list}
        adviceVariantInfo={adviceVariantInfo}
        headlineOffersCount={headlineOffersCount}
        searchGroupList={subcategories.searchGroups}
        subcategory={subcategoriesMapping[offer.subcategoryId]}
        defaultReaction={booking?.userReaction}
        onReactionButtonPress={booking?.canReact ? showReactionModal : undefined}
        userId={user?.id}
        onShowClubAdviceWritersModal={handleOnShowClubAdviceWritersModal}
        hasVideoCookiesConsent={hasVideoCookiesConsent}
        onVideoConsentPress={handleOnVideoConsentPress}
        isMultiArtistsEnabled={isMultiArtistsEnabled}
        onShowOfferArtistsModal={handleShowOfferArtistsModal}
        proAdvicesCount={proAdvices?.nbResults}
        proAdvicesSegment={proAdvicesSegment}
      />
    </Page>
  )
}
