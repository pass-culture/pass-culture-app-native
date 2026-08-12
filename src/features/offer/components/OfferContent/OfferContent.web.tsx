import React, { FunctionComponent, useCallback, useMemo, useRef, useState } from 'react'
import styled from 'styled-components/native'

import { OfferContentBase } from 'features/offer/components/OfferContent/OfferContentBase'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { OfferContentProps } from 'features/offer/types'
import { analytics } from 'libs/analytics/provider'
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
  clubAdvices,
  proAdvices,
  adviceVariantInfo,
  defaultReaction,
  onReactionButtonPress,
  onShowClubAdviceWritersModal,
  headlineOffersCount,
  hasVideoCookiesConsent,
  onVideoConsentPress,
  HeaderComponent,
  proAdvicesCount,
}) => {
  const { visible, showModal, hideModal } = useModal(false)
  const headerHeight = useGetHeaderHeight()
  const [carouselDefaultIndex, setCarouselDefaultIndex] = useState(0)

  const offerImages: ImageWithCredit[] = useMemo(
    () => (offer.images ? getImagesUrlsWithCredit<ImageWithCredit>(offer.images) : []),
    [offer.images]
  )

  const offerImagesUrl = useMemo(() => offerImages.map((image) => image.url), [offerImages])

  const lastLoggedImageIndex = useRef(0)

  const handlePreviewPress = (defaultIndex = 0) => {
    if (!offer.images) return
    setCarouselDefaultIndex(defaultIndex)
    lastLoggedImageIndex.current = defaultIndex
    showModal()
  }

  const handleCarouselSnapToItem = useCallback(
    (imageIndex: number) => {
      if (imageIndex === lastLoggedImageIndex.current) return
      lastLoggedImageIndex.current = imageIndex
      analytics.logOfferImagesScroll({
        offerId: offer.id,
        nbImages: offerImagesUrl.length,
        imageIndex,
        from: 'offerPreview',
      })
    },
    [offer.id, offerImagesUrl.length]
  )

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
          onSnapToItem={offerImagesUrl.length > 1 ? handleCarouselSnapToItem : undefined}
        />
        <StyledOfferContentBase
          offer={offer}
          searchGroupList={searchGroupList}
          subcategory={subcategory}
          clubAdvices={clubAdvices}
          proAdvices={proAdvices}
          proAdvicesCount={proAdvicesCount}
          adviceVariantInfo={adviceVariantInfo}
          onOfferPreviewPress={handlePreviewPress}
          BodyWrapper={BodyWrapper}
          defaultReaction={defaultReaction}
          onReactionButtonPress={onReactionButtonPress}
          headlineOffersCount={headlineOffersCount}
          onLayout={onLayout}
          onShowClubAdviceWritersModal={onShowClubAdviceWritersModal}
          hasVideoCookiesConsent={hasVideoCookiesConsent}
          onVideoConsentPress={onVideoConsentPress}
          HeaderComponent={HeaderComponent}>
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
        paddingTop: designSystem.size.spacing.xxxxl + headerHeight,
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
