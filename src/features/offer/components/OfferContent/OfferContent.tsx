import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { OfferContentBase } from 'features/offer/components/OfferContent/OfferContentBase'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { OfferContentProps } from 'features/offer/types'
import { analytics } from 'libs/analytics/provider'
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
}) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const isVideoSectionEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_VIDEO_SECTION)
  const shouldShowVideoSection = offer.video?.id && isVideoSectionEnabled

  const handlePreviewPress = (defaultIndex = 0) => {
    if (!offer.images) return
    navigate('OfferPreview', { id: offer.id, defaultIndex })
  }

  const handleVideoPress = () => {
    analytics.logConsultVideo({ from: 'offer' })
    navigate('OfferVideoPreview', { id: offer.id })
  }

  const { onLayout, height: comingSoonFooterHeight } = useLayout()

  return (
    <OfferCTAProvider>
      <OfferContentBase
        offer={offer}
        searchGroupList={searchGroupList}
        contentContainerStyle={CONTENT_CONTAINER_STYLE}
        onOfferPreviewPress={handlePreviewPress}
        onSeeVideoPress={shouldShowVideoSection ? handleVideoPress : undefined}
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
        onShowChroniclesWritersModal={onShowChroniclesWritersModal}>
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

const ComingSoonFooterOffset = styled.View<{ height: number }>(({ height }) => ({
  height: height + getSpacing(8) - CONTENT_CONTAINER_STYLE.paddingBottom,
}))
