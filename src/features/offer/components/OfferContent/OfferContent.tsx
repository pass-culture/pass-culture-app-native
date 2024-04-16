import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Platform } from 'react-native'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponse, SearchGroupResponseModelv2 } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferBodyImagePlaceholder } from 'features/offer/components/OfferBodyImagePlaceholder'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferImageContainer } from 'features/offer/components/OfferImageContainer/OfferImageContainer'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
import { OfferPlaylistList } from 'features/offer/components/OfferPlaylistList/OfferPlaylistList'
import { OfferWebMetaHeader } from 'features/offer/components/OfferWebMetaHeader'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useFunctionOnce } from 'libs/hooks'
import { useLocation } from 'libs/location'
import { Subcategory } from 'libs/subcategories/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  offer: OfferResponse
  searchGroupList: SearchGroupResponseModelv2[]
  subcategory: Subcategory
}

const DELAY_BEFORE_CONSIDERING_PAGE_SEEN = 5000

const isWeb = Platform.OS === 'web'

export const OfferContent: FunctionComponent<Props> = ({ offer, searchGroupList, subcategory }) => {
  const { userLocation } = useLocation()
  const { navigate } = useNavigation<UseNavigationType>()
  const enableOfferPreview = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_PREVIEW)
  const { isDesktopViewport } = useTheme()
  const headerHeight = useGetHeaderHeight()

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

  const { trackEventHasSeenOfferOnce, shouldTriggerBatchSurveyEvent, trackBatchEvent } =
    useOfferBatchTracking({
      offerNativeCategory: subcategory.nativeCategoryId,
    })

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

  const shouldDisplayOfferPreview = enableOfferPreview && !isWeb

  const onPress = () => {
    if (shouldDisplayOfferPreview && offer.image) {
      navigate('OfferPreview', { id: offer.id })
    }
  }
  const imageUrl = offer.image?.url

  return (
    <Container>
      <OfferWebMetaHeader offer={offer} />
      {isWeb ? (
        <OfferHeader title={offer.name} headerTransition={headerTransition} offer={offer} />
      ) : null}

      <ScrollViewContainer
        testID="offerv2-container"
        scrollEventThrottle={16}
        scrollIndicatorInsets={scrollIndicatorInsets}
        bounces={false}
        onScroll={onScroll}>
        {isDesktopViewport ? (
          <BodyDesktopContainer headerHeight={headerHeight} testID="offer-body-desktop">
            <OfferImageWrapper
              imageUrl={imageUrl}
              shouldDisplayOfferPreview={shouldDisplayOfferPreview}
              isSticky>
              {imageUrl ? (
                <OfferBodyImage imageUrl={imageUrl} />
              ) : (
                <OfferBodyImagePlaceholder categoryId={subcategory.categoryId} />
              )}
            </OfferImageWrapper>
            <OfferBody
              offer={offer}
              subcategory={subcategory}
              trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
            />
          </BodyDesktopContainer>
        ) : (
          <ViewGap gap={8} testID="offer-body-mobile">
            <OfferImageContainer
              imageUrl={imageUrl}
              categoryId={subcategory.categoryId}
              shouldDisplayOfferPreview={shouldDisplayOfferPreview}
              onPress={onPress}
            />
            <OfferBody
              offer={offer}
              subcategory={subcategory}
              trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
            />
          </ViewGap>
        )}

        <OfferPlaylistList
          offer={offer}
          position={userLocation}
          sameCategorySimilarOffers={sameCategorySimilarOffers}
          apiRecoParamsSameCategory={apiRecoParamsSameCategory}
          otherCategoriesSimilarOffers={otherCategoriesSimilarOffers}
          apiRecoParamsOtherCategories={apiRecoParamsOtherCategories}
          sameArtistPlaylist={sameArtistPlaylist}
        />
        {!isDesktopViewport ? <Spacer.Column numberOfSpaces={22} /> : null}
      </ScrollViewContainer>
      {/* OfferHeader is called after Body to implement the BlurView for iOS */}
      {!isWeb ? (
        <OfferHeader title={offer.name} headerTransition={headerTransition} offer={offer} />
      ) : null}
      {!isDesktopViewport ? (
        <OfferCTAButton
          offer={offer}
          subcategory={subcategory}
          trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
        />
      ) : null}
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

const BodyDesktopContainer = styled.View<{ headerHeight: number }>(({ headerHeight }) => ({
  flexDirection: 'row',
  paddingHorizontal: getSpacing(16),
  paddingTop: getSpacing(12) + headerHeight,
  paddingBottom: getSpacing(12),
  gap: getSpacing(16),
}))
