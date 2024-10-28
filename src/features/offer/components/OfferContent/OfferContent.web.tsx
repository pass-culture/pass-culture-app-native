import React, { FunctionComponent, useMemo, useState } from 'react'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { OfferImageResponse } from 'api/gen'
import { OfferContentBase } from 'features/offer/components/OfferContent/OfferContentBase'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { OfferPreviewModal } from 'features/offer/components/OfferPreviewModal/OfferPreviewModal'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { OfferContentProps } from 'features/offer/types'
import { getImagesUrls } from 'shared/getImagesUrls/getImagesUrls'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { useModal } from 'ui/components/modals/useModal'
import { getSpacing } from 'ui/theme'

export const OfferContent: FunctionComponent<OfferContentProps> = ({
  offer,
  searchGroupList,
  subcategory,
}) => {
  const { visible, showModal, hideModal } = useModal(false)
  const { isDesktopViewport } = useTheme()
  const headerHeight = useGetHeaderHeight()
  const [carouselDefaultIndex, setCarouselDefaultIndex] = useState(0)

  const offerImages = useMemo(
    () => (offer.images ? getImagesUrls<OfferImageResponse>(offer.images) : []),
    [offer.images]
  )

  const { trackEventHasSeenOfferOnce } = useOfferBatchTracking({
    offerNativeCategory: subcategory.nativeCategoryId,
  })

  const handlePress = (defaultIndex = 0) => {
    setCarouselDefaultIndex(defaultIndex)
    showModal()
  }

  const footer = isDesktopViewport ? null : (
    <OfferCTAButton
      offer={offer}
      subcategory={subcategory}
      trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
    />
  )

  const BodyWrapper = useMemo(
    () =>
      styled(StyledWrapper).attrs(({ theme: { isDesktopViewport } }) => ({
        testID: isDesktopViewport ? 'offer-body-desktop' : 'offer-body-mobile',
        headerHeight,
      }))``,
    [headerHeight]
  )

  return (
    <React.Fragment>
      <OfferPreviewModal
        hideModal={hideModal}
        isVisible={visible}
        offerImages={offerImages}
        defaultIndex={carouselDefaultIndex}
      />
      <StyledOfferContentBase
        offer={offer}
        searchGroupList={searchGroupList}
        subcategory={subcategory}
        onOfferPreviewPress={handlePress}
        BodyWrapper={BodyWrapper}
        footer={footer}
      />
    </React.Fragment>
  )
}

const StyledOfferContentBase = styled(OfferContentBase).attrs(
  ({ theme: { isDesktopViewport } }) => ({
    contentContainerStyle: { paddingBottom: isDesktopViewport ? 0 : getSpacing(22) },
  })
)``

const StyledWrapper = styled.View<{ headerHeight: number }>(
  ({ headerHeight, theme: { isDesktopViewport } }) => {
    if (isDesktopViewport) {
      return {
        flexDirection: 'row',
        paddingHorizontal: getSpacing(16),
        paddingTop: getSpacing(12) + headerHeight,
        paddingBottom: getSpacing(12),
        gap: getSpacing(16),
      }
    }
    return {
      gap: getSpacing(8),
    }
  }
)
