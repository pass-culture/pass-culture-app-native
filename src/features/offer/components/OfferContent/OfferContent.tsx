import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { OfferContentBase } from 'features/offer/components/OfferContent/OfferContentBase'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { OfferContentProps } from 'features/offer/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { useLayout } from 'ui/hooks/useLayout'
import { getSpacing } from 'ui/theme'

const CONTENT_CONTAINER_STYLE = { paddingBottom: getSpacing(22) }

export const OfferContent: FunctionComponent<OfferContentProps> = ({
  offer,
  searchGroupList,
  subcategory,
  chronicles,
  chronicleVariantInfo,
  defaultReaction,
  headlineOffersCount,
  onReactionButtonPress,
  onShowChroniclesWritersModal,
  userId,
  hasVideoCookiesConsent,
  onVideoConsentPress,
  isMultiArtistsEnabled,
  onShowOfferArtistsModal,
}) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const isVideoSectionEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_VIDEO_SECTION)

  const handlePreviewPress = (defaultIndex = 0) => {
    if (!offer.images) return
    navigate('OfferPreview', { id: offer.id, defaultIndex })
  }

  const { onLayout, height: comingSoonFooterHeight } = useLayout()

  return (
    <OfferCTAProvider>
      <OfferContentBase
        offer={offer}
        searchGroupList={searchGroupList}
        contentContainerStyle={CONTENT_CONTAINER_STYLE}
        onOfferPreviewPress={handlePreviewPress}
        isVideoSectionEnabled={isVideoSectionEnabled}
        BodyWrapper={BodyWrapper}
        chronicles={chronicles}
        chronicleVariantInfo={chronicleVariantInfo}
        headlineOffersCount={headlineOffersCount}
        subcategory={subcategory}
        defaultReaction={defaultReaction}
        onReactionButtonPress={onReactionButtonPress}
        onLayout={onLayout}
        userId={userId}
        onShowChroniclesWritersModal={onShowChroniclesWritersModal}
        hasVideoCookiesConsent={hasVideoCookiesConsent}
        onVideoConsentPress={onVideoConsentPress}
        onShowOfferArtistsModal={onShowOfferArtistsModal}
        isMultiArtistsEnabled={isMultiArtistsEnabled}>
        {comingSoonFooterHeight ? (
          <ComingSoonFooterOffset
            testID="coming-soon-footer-offset"
            height={comingSoonFooterHeight}
          />
        ) : null}
      </OfferContentBase>
    </OfferCTAProvider>
  )
}

const BodyWrapper = styled(ViewGap).attrs(() => ({ gap: 8, testID: 'offer-body-mobile' }))``

const ComingSoonFooterOffset = styled.View<{ height: number }>(({ height, theme }) => ({
  height: height + theme.designSystem.size.spacing.xxl - CONTENT_CONTAINER_STYLE.paddingBottom,
}))
