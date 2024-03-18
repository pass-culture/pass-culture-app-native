import { useNavigation } from '@react-navigation/native'
import React, { ComponentProps, FunctionComponent, useCallback, useEffect } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Platform } from 'react-native'
// we import FastImage to get the resizeMode, not to use it as a component
// eslint-disable-next-line no-restricted-imports
import FastImage from 'react-native-fast-image'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponse, SearchGroupResponseModelv2 } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { OfferBody } from 'features/offer/components/OfferBody/OfferBody'
import { OfferCTAButton } from 'features/offer/components/OfferCTAButton/OfferCTAButton'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferPlaylistList } from 'features/offer/components/OfferPlaylistList/OfferPlaylistList'
import { OfferWebMetaHeader } from 'features/offer/components/OfferWebMetaHeader'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useFunctionOnce } from 'libs/hooks'
import { useLocation } from 'libs/location'
import { mapCategoryToIcon } from 'libs/parsers'
import { FastImage as ResizedFastImage } from 'libs/resizing-image-on-demand/FastImage'
import { Subcategory } from 'libs/subcategories/types'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { useGetHeaderHeight } from 'ui/components/headers/PageHeaderWithoutPlaceholder'
import { Hero } from 'ui/components/hero/Hero'
import { useHeroDimensions } from 'ui/components/hero/useHeroDimensions'
import { ImagePlaceholder as DefaultImagePlaceholder } from 'ui/components/ImagePlaceholder'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  offer: OfferResponse
  searchGroupList: SearchGroupResponseModelv2[]
  subcategory: Subcategory
}

const DELAY_BEFORE_CONSIDERING_PAGE_SEEN = 5000

// Special case where theme.icons.sizes is not used
// TODO: factoriser avec la constante de Hero
const PLACEHOLDER_ICON_SIZE = getSpacing(24)

const isWeb = Platform.OS === 'web'

export const OfferContent: FunctionComponent<Props> = ({ offer, searchGroupList, subcategory }) => {
  const { userLocation } = useLocation()
  const { navigate } = useNavigation<UseNavigationType>()
  const enableOfferPreview = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_PREVIEW)
  const { isDesktopViewport } = useTheme()
  const { imageStyle } = useHeroDimensions()
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
  const ImagePlaceholder = styled(DefaultImagePlaceholder).attrs(
    ({ theme }): ComponentProps<typeof DefaultImagePlaceholder> => ({
      Icon: mapCategoryToIcon(subcategory.categoryId),
      backgroundColors: [theme.colors.greyLight, theme.colors.greyMedium],
      borderRadius: theme.borderRadius.radius,
      size: PLACEHOLDER_ICON_SIZE,
    })
  )({
    position: 'absolute',
    zIndex: 1,
  })
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
          <BodyContainer headerHeight={headerHeight}>
            {imageUrl ? (
              <ResizedFastImage
                style={imageStyle}
                url={imageUrl}
                resizeMode={FastImage.resizeMode?.cover}
              />
            ) : (
              <ImagePlaceholder />
            )}
            <OfferBody offer={offer} subcategory={subcategory} />
          </BodyContainer>
        ) : (
          <React.Fragment>
            <Hero
              imageUrl={imageUrl}
              categoryId={subcategory.categoryId}
              shouldDisplayOfferPreview={shouldDisplayOfferPreview}
              onPress={onPress}
            />
            <Spacer.Column numberOfSpaces={8} />
            <OfferBody offer={offer} subcategory={subcategory} />
          </React.Fragment>
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
        <Spacer.Column numberOfSpaces={22} />
      </ScrollViewContainer>
      {/* OfferHeader is called after Body to implement the BlurView for iOS */}
      {!isWeb ? (
        <OfferHeader title={offer.name} headerTransition={headerTransition} offer={offer} />
      ) : null}
      <OfferCTAButton
        offer={offer}
        subcategory={subcategory}
        trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
      />
    </Container>
  )
}

const scrollIndicatorInsets = { right: 1 }

const Container = styled.View({
  flex: 1,
})

const ScrollViewContainer = styled(IntersectionObserverScrollView)({ overflow: 'visible' })

const BodyContainer = styled.View<{ headerHeight: number }>(({ headerHeight }) => ({
  flexDirection: 'row',
  paddingHorizontal: 64,
  paddingTop: 48 + headerHeight,
  paddingBottom: 48,
  gap: 40,
}))
