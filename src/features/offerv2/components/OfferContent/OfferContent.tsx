import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useCallback, useEffect } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Platform } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { OfferResponse, SearchGroupResponseModelv2 } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferHeader } from 'features/offer/components/OfferHeader/OfferHeader'
import { OfferMessagingApps } from 'features/offer/components/OfferMessagingApps/OfferMessagingApps'
import { OfferWebMetaHeader } from 'features/offer/components/OfferWebMetaHeader'
import { getOfferPrices } from 'features/offer/helpers/getOfferPrice/getOfferPrice'
import { useOfferAnalytics } from 'features/offer/helpers/useOfferAnalytics/useOfferAnalytics'
import { useOfferBatchTracking } from 'features/offer/helpers/useOfferBatchTracking/useOfferBatchTracking'
import { useOfferPlaylist } from 'features/offer/helpers/useOfferPlaylist/useOfferPlaylist'
import { OfferAccessibility } from 'features/offerv2/components/OfferAccessibility/OfferAccessibility'
import { OfferArtists } from 'features/offerv2/components/OfferArtists/OfferArtists'
import { OfferCTAButton } from 'features/offerv2/components/OfferCTAButton/OfferCTAButton'
import { OfferMetadataList } from 'features/offerv2/components/OfferMetadataList/OfferMetadataList'
import { OfferPlace } from 'features/offerv2/components/OfferPlace/OfferPlace'
import { OfferPlaylistList } from 'features/offerv2/components/OfferPlaylistList/OfferPlaylistList'
import { OfferPrice } from 'features/offerv2/components/OfferPrice/OfferPrice'
import { OfferSummaryInfoList } from 'features/offerv2/components/OfferSummaryInfoList/OfferSummaryInfoList'
import { OfferTitle } from 'features/offerv2/components/OfferTitle/OfferTitle'
import { OfferVenueButton } from 'features/offerv2/components/OfferVenueButton/OfferVenueButton'
import { getOfferArtists } from 'features/offerv2/helpers/getOfferArtists/getOfferArtists'
import { getOfferMetadata } from 'features/offerv2/helpers/getOfferMetadata/getOfferMetadata'
import { getOfferTags } from 'features/offerv2/helpers/getOfferTags/getOfferTags'
import { useLogScrollHandler } from 'features/offerv2/helpers/useLogScrolHandler/useLogScrollHandler'
import { isCloseToBottom } from 'libs/analytics'
import { useLocation } from 'libs/location'
import { Subcategory } from 'libs/subcategories/types'
import { isNullOrUndefined } from 'shared/isNullOrUndefined/isNullOrUndefined'
import { useOpacityTransition } from 'ui/animations/helpers/useOpacityTransition'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'
import { Hero } from 'ui/components/hero/Hero'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  offer: OfferResponse
  searchGroupList: SearchGroupResponseModelv2[]
  subcategory: Subcategory
}

const DELAY_BEFORE_CONSIDERING_PAGE_SEEN = 5000

const isWeb = Platform.OS === 'web'

export const OfferContent: FunctionComponent<Props> = ({ offer, searchGroupList, subcategory }) => {
  const route = useRoute<UseRouteType<'Offer'>>()
  const fromOfferId = route.params.fromOfferId

  const { userLocation } = useLocation()

  const extraData = offer.extraData ?? undefined
  const tags = getOfferTags(subcategory.appLabel, extraData)
  const artists = getOfferArtists(subcategory.categoryId, offer)
  const prices = getOfferPrices(offer.stocks)

  const {
    sameArtistPlaylist,
    refetchSameArtistPlaylist,
    sameCategorySimilarOffers,
    apiRecoParamsSameCategory,
    otherCategoriesSimilarOffers,
    apiRecoParamsOtherCategories,
  } = useOfferPlaylist({ offer, offerSearchGroup: subcategory.searchGroupName, searchGroupList })

  const {
    logSameArtistPlaylistVerticalScroll,
    logSameCategoryPlaylistVerticalScroll,
    logOtherCategoriesPlaylistVerticalScroll,
    logConsultWholeOffer,
  } = useOfferAnalytics({
    offerId: offer.id,
    nbSameArtistPlaylist: sameArtistPlaylist.length,
    apiRecoParamsSameCategory,
    nbSameCategorySimilarOffers: sameCategorySimilarOffers?.length ?? 0,
    apiRecoParamsOtherCategories,
    nbOtherCategoriesSimilarOffers: otherCategoriesSimilarOffers?.length ?? 0,
    fromOfferId,
  })

  const authors = offer.extraData?.author
  const ean = offer.extraData?.ean
  useEffect(() => {
    if (authors && ean) {
      refetchSameArtistPlaylist()
    }
  }, [authors, ean, refetchSameArtistPlaylist])

  const handleChangeSameArtistPlaylistDisplay = useLogScrollHandler(
    logSameArtistPlaylistVerticalScroll
  )

  const handleChangeOtherCategoriesPlaylistDisplay = useLogScrollHandler(
    logOtherCategoriesPlaylistVerticalScroll
  )

  const handleChangeSameCategoryPlaylistDisplay = useLogScrollHandler(
    logSameCategoryPlaylistVerticalScroll
  )

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
        <Hero imageUrl={offer.image?.url} type="offerv2" categoryId={subcategory.categoryId} />
        <Spacer.Column numberOfSpaces={8} />
        <InfoContainer>
          <InformationTags tags={tags} />
          <Spacer.Column numberOfSpaces={4} />

          <OfferTitle offerName={offer.name} />
          <Spacer.Column numberOfSpaces={2} />

          <OfferArtists artists={artists} />
          <Spacer.Column numberOfSpaces={6} />

          <OfferPrice prices={prices} />

          {offer.venue.isPermanent ? (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={6} />
              <OfferVenueButton venue={offer.venue} />
            </React.Fragment>
          ) : null}

          <OfferSummaryInfoList offer={offer} />
          <OfferAbout offer={offer} />
        </InfoContainer>

        <OfferPlace offer={offer} geolocPosition={userLocation} isEvent={subcategory.isEvent} />
        <Spacer.Column numberOfSpaces={6} />

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
          handleChangeSameArtistPlaylistDisplay={handleChangeSameArtistPlaylistDisplay}
          handleChangeOtherCategoriesPlaylistDisplay={handleChangeOtherCategoriesPlaylistDisplay}
          handleChangeSameCategoryPlaylistDisplay={handleChangeSameCategoryPlaylistDisplay}
        />
        <SectionWithDivider visible>
          <Spacer.Column numberOfSpaces={22} />
        </SectionWithDivider>
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

const ScrollViewContainer = styled(IOScrollView)({ overflow: 'visible' })

const InfoContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
