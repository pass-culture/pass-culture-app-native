import React, { FunctionComponent, PropsWithChildren, useCallback, useMemo, useState } from 'react'
import { Animated } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { OfferContentBase } from 'features/offer/components/OfferContent/OfferContentBase'
import { OfferContentProps } from 'features/offer/components/OfferContent/types'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferPreviewModal } from 'features/offer/components/OfferPreviewModal/OfferPreviewModal'
import { getOfferImageUrls } from 'features/offer/helpers/getOfferImageUrls/getOfferImageUrls'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { useModal } from 'ui/components/modals/useModal'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

export const OfferContent: FunctionComponent<OfferContentProps> = ({
  offer,
  searchGroupList,
  subcategory,
}) => {
  const showOfferPreview = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_PREVIEW)
  const { visible, showModal, hideModal } = useModal(false)
  const { isDesktopViewport } = useTheme()
  const headerHeight = useGetHeaderHeight()
  const [carouselDefaultIndex, setCarouselDefaultIndex] = useState(0)

  const offerImages = useMemo(
    () => (offer.images ? getOfferImageUrls(offer.images) : []),
    [offer.images]
  )

  const { trackEventHasSeenOfferOnce } = useOfferBatchTracking({
    offerNativeCategory: subcategory.nativeCategoryId,
  })

  const handlePress = (defaultIndex = 0) => {
    if (showOfferPreview) {
      setCarouselDefaultIndex(defaultIndex)
      showModal()
    }
  }

  const contentContainerStyle = { paddingBottom: isDesktopViewport ? 0 : getSpacing(22) }
  const BodyWrapper = useCallback(
    ({ children }: PropsWithChildren) =>
      isDesktopViewport ? (
        <BodyDesktopContainer headerHeight={headerHeight} testID="offer-body-desktop">
          {children}
        </BodyDesktopContainer>
      ) : (
        <ViewGap gap={8} testID="offer-body-mobile">
          {children}
        </ViewGap>
      ),
    [isDesktopViewport, headerHeight]
  )

  const header = useCallback(
    (headerTransition: Animated.AnimatedInterpolation<string | number>) => (
      <OfferHeader title={offer.name} headerTransition={headerTransition} offer={offer} />
    ),
    [offer]
  )

  const mobileModeFooter = useCallback(
    (_: Animated.AnimatedInterpolation<string | number>) => (
      <OfferCTAButton
        offer={offer}
        subcategory={subcategory}
        trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
      />
    ),
    [offer, subcategory, trackEventHasSeenOfferOnce]
  )

  return (
    <React.Fragment>
      <OfferPreviewModal
        hideModal={hideModal}
        isVisible={visible}
        offerImages={offerImages}
        defaultIndex={carouselDefaultIndex}
      />
      <OfferContentBase
        showOfferPreview={showOfferPreview}
        offer={offer}
        header={header}
        searchGroupList={searchGroupList}
        subcategory={subcategory}
        onOfferPreviewPress={handlePress}
        footer={isDesktopViewport ? undefined : mobileModeFooter}
        contentContainerStyle={contentContainerStyle}>
        {(body) => <BodyWrapper>{body}</BodyWrapper>}
      </OfferContentBase>
    </React.Fragment>
  )
}

const BodyDesktopContainer = styled.View<{ headerHeight: number }>(({ headerHeight }) => ({
  flexDirection: 'row',
  paddingHorizontal: getSpacing(16),
  paddingTop: getSpacing(12) + headerHeight,
  paddingBottom: getSpacing(12),
  gap: getSpacing(16),
}))
