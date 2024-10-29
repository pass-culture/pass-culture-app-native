import React, {
  FunctionComponent,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleProp,
  ViewStyle,
} from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { OfferImageResponse } from 'api/gen'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { OfferPlaylistList } from 'features/offer/components/OfferPlaylistList/OfferPlaylistList'
import { OfferWebMetaHeader } from 'features/offer/components/OfferWebMetaHeader'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { OfferContentProps } from 'features/offer/types'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { useFunctionOnce } from 'libs/hooks'
import { getImagesUrls } from 'shared/getImagesUrls/getImagesUrls'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'

type OfferContentBaseProps = OfferContentProps & {
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
  footer,
  onOfferPreviewPress,
  contentContainerStyle,
  BodyWrapper = React.Fragment,
}) => {
  const {
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
  } = useOfferPlaylist({ offer, offerSearchGroup: subcategory.searchGroupName, searchGroupList })
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollYRef = useRef<number>(0)

  const logConsultWholeOffer = useFunctionOnce(() => {
    analytics.logConsultWholeOffer(offer.id)
  })

  const { shouldTriggerBatchSurveyEvent, trackBatchEvent, trackEventHasSeenOfferOnce } =
    useOfferBatchTracking(subcategory.id)

  const offerImages = useMemo(
    () => (offer.images ? getImagesUrls<OfferImageResponse>(offer.images) : []),
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

  const handleCheckScrollY = () => {
    return scrollYRef.current
  }

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScroll(event)
      scrollYRef.current = event.nativeEvent.contentOffset.y
    },
    [onScroll]
  )

  return (
    <Container>
      <OfferWebMetaHeader offer={offer} />
      <OfferHeader title={offer.name} headerTransition={headerTransition} offer={offer} />
      <AnchorProvider scrollViewRef={scrollViewRef} handleCheckScrollY={handleCheckScrollY}>
        <ScrollViewContainer
          testID="offerv2-container"
          scrollEventThrottle={16}
          scrollIndicatorInsets={scrollIndicatorInsets}
          bounces={false}
          ref={scrollViewRef}
          contentContainerStyle={contentContainerStyle}
          onScroll={handleScroll}>
          <BodyWrapper>
            <OfferImageContainer
              imageUrls={offerImages}
              categoryId={subcategory.categoryId}
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
            sameCategorySimilarOffers={sameCategorySimilarOffers}
            apiRecoParamsSameCategory={apiRecoParamsSameCategory}
            otherCategoriesSimilarOffers={otherCategoriesSimilarOffers}
            apiRecoParamsOtherCategories={apiRecoParamsOtherCategories}
          />
        </ScrollViewContainer>
      </AnchorProvider>
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
