import React, { FunctionComponent, ReactElement, useCallback, useEffect, useMemo } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ViewStyle, StyleProp } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { OfferPlaylistList } from 'features/offer/components/OfferPlaylistList/OfferPlaylistList'
import { OfferWebMetaHeader } from 'features/offer/components/OfferWebMetaHeader'
import { getOfferImageUrls } from 'features/offer/helpers/getOfferImageUrls/getOfferImageUrls'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { OfferContentProps } from 'features/offer/types'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { useFunctionOnce } from 'libs/hooks'
import { useLocation } from 'libs/location'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'

type OfferContentBaseProps = OfferContentProps & {
  showOfferPreview: boolean
  BodyWrapper: FunctionComponent
  onOfferPreviewPress: (index?: number) => void
  footer?: ReactElement | null
  contentContainerStyle?: StyleProp<ViewStyle>
}

const DELAY_BEFORE_CONSIDERING_PAGE_SEEN = 5000

export const OfferContentBase: FunctionComponent<OfferContentBaseProps> = ({
  offer,
  searchGroupList,
  subcategory,
  showOfferPreview,
  footer,
  onOfferPreviewPress,
  contentContainerStyle,
  BodyWrapper = React.Fragment,
}) => {
  const { userLocation } = useLocation()
  const {
    sameArtistPlaylist,
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
  } = useOfferPlaylist({ offer, offerSearchGroup: subcategory.searchGroupName, searchGroupList })

  const logConsultWholeOffer = useFunctionOnce(() => {
    analytics.logConsultWholeOffer(offer.id)
  })

  const { shouldTriggerBatchSurveyEvent, trackBatchEvent, trackEventHasSeenOfferOnce } =
    useOfferBatchTracking({
      offerNativeCategory: subcategory.nativeCategoryId,
    })

  const offerImages = useMemo(
    () => (offer.images ? getOfferImageUrls(offer.images) : []),
    [offer.images]
  )

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (shouldTriggerBatchSurveyEvent) {
      timeoutId = setTimeout(() => {
        trackBatchEvent()
      }, DELAY_BEFORE_CONSIDERING_PAGE_SEEN)
    }

    return () => clearTimeout(timeoutId)
  }, [shouldTriggerBatchSurveyEvent, trackBatchEvent])

  const scrollEventListener = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isCloseToBottom(nativeEvent)) {
        logConsultWholeOffer()
        if (shouldTriggerBatchSurveyEvent) {
          trackBatchEvent()
        }
      }
    },
    [logConsultWholeOffer, shouldTriggerBatchSurveyEvent, trackBatchEvent]
  )

  const { headerTransition, onScroll } = useOpacityTransition({
    listener: scrollEventListener,
  })

  return (
    <Container>
      <OfferWebMetaHeader offer={offer} />
      <OfferHeader title={offer.name} headerTransition={headerTransition} offer={offer} />
      <ScrollViewContainer
        testID="offerv2-container"
        scrollEventThrottle={16}
        scrollIndicatorInsets={scrollIndicatorInsets}
        bounces={false}
        contentContainerStyle={contentContainerStyle}
        onScroll={onScroll}>
        <BodyWrapper>
          <OfferImageContainer
            imageUrls={offerImages}
            categoryId={subcategory.categoryId}
            shouldDisplayOfferPreview={showOfferPreview}
            onPress={offerImages.length > 0 ? onOfferPreviewPress : undefined}
          />
          <OfferBody
            offer={offer}
            subcategory={subcategory}
            trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
          />
        </BodyWrapper>
        <OfferPlaylistList
          offer={offer}
          position={userLocation}
          sameCategorySimilarOffers={sameCategorySimilarOffers}
          apiRecoParamsSameCategory={apiRecoParamsSameCategory}
          otherCategoriesSimilarOffers={otherCategoriesSimilarOffers}
          apiRecoParamsOtherCategories={apiRecoParamsOtherCategories}
          sameArtistPlaylist={sameArtistPlaylist}
        />
      </ScrollViewContainer>
      {footer}
    </Container>
  )
}

const scrollIndicatorInsets = { right: 1 }

const Container = styled.View({
  flex: 1,
})

const ScrollViewContainer = styled(IntersectionObserverScrollView)({
  overflow: 'visible',
})
