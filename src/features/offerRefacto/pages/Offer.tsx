import React from 'react'
import { View } from 'react-native'

import { ChroniclesWritersModal } from 'features/chronicle/pages/ChroniclesWritersModal/ChroniclesWritersModal'
import { OfferContent } from 'features/offer/components/OfferContent/OfferContent'
import { OfferContentPlaceholder } from 'features/offer/components/OfferContentPlaceholder/OfferContentPlaceholder'
import { OfferArtistsModal } from 'features/offer/pages/OfferArtistsModal/OfferArtistsModal'
import { DEFAULT_CHRONICLE_VARIANT_INFO } from 'features/offerRefacto/constants'
import { useOfferPageViewModel } from 'features/offerRefacto/pages/useOfferPageViewModel'
import { ReactionChoiceModal } from 'features/reactions/components/ReactionChoiceModal/ReactionChoiceModal'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { Page } from 'ui/pages/Page'

export function Offer() {
  const {
    offer,
    user,
    subcategories,
    booking,
    subcategory,
    chronicleVariantInfo,
    chronicles,
    headlineOffersCount,
    showSkeleton,
    hasVideoCookiesConsent,
    reactionModalVisible,
    chroniclesWritersModalVisible,
    offerArtistsModalVisible,
    isMultiArtistsEnabled,
    showReactionModal,
    hideReactionModal,
    hideChroniclesWritersModal,
    showOfferArtistsModal,
    hideOfferArtistsModal,
    submitReaction,
    showRecommendations,
    openChroniclesWritersModal,
    acceptVideoCookies,
  } = useOfferPageViewModel()

  if (!offer || !subcategories || !subcategory) return null

  if (showSkeleton) return <OfferContentPlaceholder />

  return (
    <Page>
      <View>
        <ReactionChoiceModal
          dateUsed={booking?.dateUsed ?? ''}
          offerId={offer.id}
          offerName={offer.name}
          imageUrl={offer.images?.url?.url}
          subcategoryId={offer.subcategoryId}
          closeModal={hideReactionModal}
          visible={reactionModalVisible}
          defaultReaction={booking?.userReaction}
          onSave={submitReaction}
          from={ReactionFromEnum.ENDED_BOOKING}
          bodyType={ReactionChoiceModalBodyEnum.VALIDATION}
        />

        {chronicleVariantInfo ? (
          <ChroniclesWritersModal
            closeModal={hideChroniclesWritersModal}
            isVisible={chroniclesWritersModalVisible}
            onShowRecoButtonPress={showRecommendations}
            variantInfo={chronicleVariantInfo}
          />
        ) : null}
        {offer.artists.length > 1 ? (
          <OfferArtistsModal
            isVisible={offerArtistsModalVisible}
            closeModal={hideOfferArtistsModal}
            artists={offer.artists}
            navigateTo={{ screen: 'Artist' }}
          />
        ) : null}
      </View>

      <OfferContent
        offer={offer}
        chronicles={chronicles}
        chronicleVariantInfo={chronicleVariantInfo ?? DEFAULT_CHRONICLE_VARIANT_INFO}
        headlineOffersCount={headlineOffersCount}
        searchGroupList={subcategories.searchGroups}
        subcategory={subcategory}
        defaultReaction={booking?.userReaction}
        onReactionButtonPress={booking?.canReact ? showReactionModal : undefined}
        userId={user?.id}
        onShowChroniclesWritersModal={openChroniclesWritersModal}
        hasVideoCookiesConsent={hasVideoCookiesConsent}
        onVideoConsentPress={acceptVideoCookies}
        isMultiArtistsEnabled={isMultiArtistsEnabled}
        onShowOfferArtistsModal={showOfferArtistsModal}
      />
    </Page>
  )
}
