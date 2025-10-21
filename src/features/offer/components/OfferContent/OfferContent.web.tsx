import React, { FunctionComponent, useMemo, useState } from 'react'
import styled from 'styled-components/native'

import { OfferContentBase } from 'features/offer/components/OfferContent/OfferContentBase'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { OfferContentProps } from 'features/offer/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { getImagesUrlsWithCredit } from 'shared/getImagesUrlsWithCredit/getImagesUrlsWithCredit'
import { useGetHeaderHeight } from 'shared/header/useGetHeaderHeight'
import { ImageWithCredit } from 'shared/types'
import { ImagesCarouselModal } from 'ui/components/ImagesCarouselModal/ImagesCarouselModal'
import { useModal } from 'ui/components/modals/useModal'
import { useLayout } from 'ui/hooks/useLayout'
import { getSpacing } from 'ui/theme'

export const OfferContent: FunctionComponent<OfferContentProps> = ({
  offer,
  searchGroupList,
  subcategory,
  chronicles,
  chronicleVariantInfo,
  defaultReaction,
  onReactionButtonPress,
  onShowChroniclesWritersModal,
  headlineOffersCount,
  hasVideoCookiesConsent,
  onVideoConsentPress,
}) => {
  const { visible, showModal, hideModal } = useModal(false)
  const headerHeight = useGetHeaderHeight()
  const [carouselDefaultIndex, setCarouselDefaultIndex] = useState(0)

  const isVideoSectionEnabled = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_VIDEO_SECTION)

  const offerImages: ImageWithCredit[] = useMemo(
    () => (offer.images ? getImagesUrlsWithCredit<ImageWithCredit>(offer.images) : []),
    [offer.images]
  )

  const offerImagesUrl = useMemo(() => offerImages.map((image) => image.url), [offerImages])

  const handlePreviewPress = (defaultIndex = 0) => {
    if (!offer.images) return
    setCarouselDefaultIndex(defaultIndex)
    showModal()
  }

  const BodyWrapper = useMemo(
    () =>
      styled(StyledWrapper).attrs(({ theme: { isDesktopViewport } }) => ({
        testID: isDesktopViewport ? 'offer-body-desktop' : 'offer-body-mobile',
        headerHeight,
      }))``,
    [headerHeight]
  )

  const { onLayout, height: comingSoonFooterHeight } = useLayout()

  return (
    <OfferCTAProvider>
      <React.Fragment>
        <ImagesCarouselModal
          hideModal={hideModal}
          isVisible={visible}
          imagesURL={offerImagesUrl}
          defaultIndex={carouselDefaultIndex}
        />
        <StyledOfferContentBase
          offer={offer}
          searchGroupList={searchGroupList}
          subcategory={subcategory}
          chronicles={chronicles}
          chronicleVariantInfo={chronicleVariantInfo}
          onOfferPreviewPress={handlePreviewPress}
          isVideoSectionEnabled={isVideoSectionEnabled}
          BodyWrapper={BodyWrapper}
          defaultReaction={defaultReaction}
          onReactionButtonPress={onReactionButtonPress}
          headlineOffersCount={headlineOffersCount}
          onLayout={onLayout}
          onShowChroniclesWritersModal={onShowChroniclesWritersModal}
          hasVideoCookiesConsent={hasVideoCookiesConsent}
          onVideoConsentPress={onVideoConsentPress}>
          {comingSoonFooterHeight ? (
            <ComingSoonFooterOffset height={comingSoonFooterHeight} />
          ) : null}
        </StyledOfferContentBase>
      </React.Fragment>
    </OfferCTAProvider>
  )
}

const StyledOfferContentBase = styled(OfferContentBase).attrs(
  ({ theme: { isDesktopViewport } }) => ({
    contentContainerStyle: { paddingBottom: isDesktopViewport ? 0 : getSpacing(22) },
  })
)``

const StyledWrapper = styled.View<{ headerHeight: number }>(
  ({ headerHeight, theme: { isDesktopViewport, designSystem } }) => {
    if (isDesktopViewport) {
      return {
        flexDirection: 'row',
        paddingHorizontal: getSpacing(16),
        paddingTop: getSpacing(12) + headerHeight,
        paddingBottom: designSystem.size.spacing.xxxxl,
        gap: getSpacing(16),
      }
    }
    return {
      gap: designSystem.size.spacing.xxl,
    }
  }
)

const ComingSoonFooterOffset = styled.View<{ height: number }>(({ height }) => ({
  height,
}))
