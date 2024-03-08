import { useNavigation } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Platform, View } from 'react-native'
import { IOScrollView as IntersectionObserverScrollView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { OfferResponse, SearchGroupResponseModelv2, SubcategoryIdEnum } from 'api/gen'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferMessagingApps } from 'features/offer/components/OfferMessagingApps/OfferMessagingApps'
import { OfferWebMetaHeader } from 'features/offer/components/OfferWebMetaHeader'
import { getOfferPrices } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { useOfferSummaryInfoList } from 'features/offer/helpers/useOfferSummaryInfoList/useOfferSummaryInfoList'
import { MovieScreeningCalendar } from 'features/offerv2/components/MovieScreeningCalendar/MovieScreeningCalendar'
import { OfferAbout } from 'features/offerv2/components/OfferAbout/OfferAbout'
import { OfferArtists } from 'features/offerv2/components/OfferArtists/OfferArtists'
import { OfferCTAButton } from 'features/offerv2/components/OfferCTAButton/OfferCTAButton'
import { OfferPlace } from 'features/offerv2/components/OfferPlace/OfferPlace'
import { OfferPlaylistList } from 'features/offerv2/components/OfferPlaylistList/OfferPlaylistList'
import { OfferPrice } from 'features/offerv2/components/OfferPrice/OfferPrice'
import { OfferSummaryInfoList } from 'features/offerv2/components/OfferSummaryInfoList/OfferSummaryInfoList'
import { OfferTitle } from 'features/offerv2/components/OfferTitle/OfferTitle'
import { OfferVenueButton } from 'features/offerv2/components/OfferVenueButton/OfferVenueButton'
import { getOfferArtists } from 'features/offerv2/helpers/getOfferArtists/getOfferArtists'
import { getOfferTags } from 'features/offerv2/helpers/getOfferTags/getOfferTags'
import { analytics, isCloseToBottom } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useFunctionOnce } from 'libs/hooks'
import { useLocation } from 'libs/location'
import { Subcategory } from 'libs/subcategories/types'
import { FeatureFlag } from 'shared/FeatureFlag/FeatureFlag'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { Hero } from 'ui/components/hero/Hero'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { Separator } from 'ui/components/Separator'
import { InformationTags } from 'ui/InformationTags/InformationTags'
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

  const extraData = offer.extraData ?? undefined
  const tags = getOfferTags(subcategory.appLabel, extraData)
  const artists = getOfferArtists(subcategory.categoryId, offer)
  const prices = getOfferPrices(offer.stocks)

  const isOfferAMovieScreening = offer.subcategoryId === SubcategoryIdEnum.SEANCE_CINE

  const { summaryInfoItems } = useOfferSummaryInfoList({ offer })

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
        <Hero
          imageUrl={offer.image?.url}
          type="offerv2"
          categoryId={subcategory.categoryId}
          shouldDisplayOfferPreview={shouldDisplayOfferPreview}
          onPress={onPress}
        />
        <Spacer.Column numberOfSpaces={8} />
        <InfoContainer>
          <GroupWithoutGap>
            <InformationTags tags={tags} />
            <Spacer.Column numberOfSpaces={4} />
            <OfferTitle offerName={offer.name} />

            {artists ? (
              <React.Fragment>
                <Spacer.Column numberOfSpaces={2} />
                <OfferArtists artists={artists} />
              </React.Fragment>
            ) : null}
          </GroupWithoutGap>

          {prices ? <OfferPrice prices={prices} /> : null}

          {!offer.venue.isPermanent && summaryInfoItems.length === 0 ? null : (
            <GroupWithoutGap>
              {offer.venue.isPermanent ? <OfferVenueButton venue={offer.venue} /> : null}

              {!offer.venue.isPermanent && summaryInfoItems.length === 0 ? null : (
                <Separator.Horizontal testID="topSeparator" />
              )}

              {summaryInfoItems.length === 0 ? null : (
                <OfferSummaryInfoList summaryInfoItems={summaryInfoItems} />
              )}
            </GroupWithoutGap>
          )}

          <OfferAbout offer={offer} />
        </InfoContainer>

        <OfferPlace offer={offer} isEvent={subcategory.isEvent} />
        <Spacer.Column numberOfSpaces={8} />

        {isOfferAMovieScreening ? (
          <FeatureFlag featureFlag={RemoteStoreFeatureFlags.WIP_ENABLE_NEW_XP_CINE_FROM_OFFER}>
            <MovieScreeningCalendar offerId={offer.id} stocks={offer.stocks} />
          </FeatureFlag>
        ) : null}

        <SectionWithDivider visible margin>
          <Spacer.Column numberOfSpaces={2} />
          <OfferMessagingApps offer={offer} />
        </SectionWithDivider>

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

const InfoContainer = styled.View({
  marginHorizontal: getSpacing(6),
  gap: getSpacing(6),
})

const GroupWithoutGap = View
