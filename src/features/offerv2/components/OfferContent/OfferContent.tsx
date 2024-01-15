import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import { View } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'
import styled from 'styled-components/native'

import { OfferResponse, SearchGroupResponseModelv2 } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
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
import { useLocation } from 'libs/location'
import { Subcategory } from 'libs/subcategories/types'
import { isNullOrUndefined } from 'shared/isNullOrUndefined/isNullOrUndefined'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  offer: OfferResponse
  searchGroupList: SearchGroupResponseModelv2[]
  subcategory: Subcategory
}

const NUMBER_OF_LINES_OF_DESCRIPTION_BLOCK = 5

export const OfferContent: FunctionComponent<Props> = ({ offer, searchGroupList, subcategory }) => {
  const route = useRoute<UseRouteType<'Offer'>>()
  const fromOfferId = route.params.fromOfferId

  const { userLocation } = useLocation()

  const extraData = offer.extraData ?? undefined
  const tags = getOfferTags(subcategory.appLabel, extraData)
  const artists = getOfferArtists(subcategory.categoryId, offer)
  const prices = getOfferPrices(offer.stocks)
  const metadata = getOfferMetadata(extraData)
  const hasMetadata = metadata.length > 0

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

  const shouldDisplayAccessibilityBlock = !(
    isNullOrUndefined(offer.accessibility.visualDisability) &&
    isNullOrUndefined(offer.accessibility.audioDisability) &&
    isNullOrUndefined(offer.accessibility.mentalDisability) &&
    isNullOrUndefined(offer.accessibility.motorDisability)
  )
  const shouldDisplayAboutBlock =
    shouldDisplayAccessibilityBlock || !!offer.description || hasMetadata

  const { trackEventHasSeenOfferOnce } = useOfferBatchTracking({
    offerNativeCategory: subcategory.nativeCategoryId,
  })

  return (
    <Container>
      <ScrollViewContainer testID="offerv2-container">
        <InfoContainer>
          <View style={{ height: 500 }}></View>
          <InformationTags tags={tags} />

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

          {shouldDisplayAboutBlock ? (
            <React.Fragment>
              <Spacer.Column numberOfSpaces={8} />
              <Typo.Title3>À propos</Typo.Title3>
              <Spacer.Column numberOfSpaces={4} />

              {hasMetadata ? (
                <React.Fragment>
                  <OfferMetadataList metadata={metadata} />
                  <Spacer.Column numberOfSpaces={2} />
                </React.Fragment>
              ) : null}

              {offer.description ? (
                <React.Fragment>
                  <Typo.ButtonText>Description&nbsp;:</Typo.ButtonText>
                  <CollapsibleText numberOfLines={NUMBER_OF_LINES_OF_DESCRIPTION_BLOCK}>
                    {offer.description}
                  </CollapsibleText>
                </React.Fragment>
              ) : null}
              <Spacer.Column numberOfSpaces={8} />
              {shouldDisplayAccessibilityBlock ? (
                <OfferAccessibility accessibility={offer.accessibility} />
              ) : null}
            </React.Fragment>
          ) : null}
        </InfoContainer>

        <OfferPlace offer={offer} geolocPosition={userLocation} isEvent={subcategory.isEvent} />
        <Spacer.Column numberOfSpaces={6} />

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

      <OfferCTAButton
        offer={offer}
        subcategory={subcategory}
        trackEventHasSeenOfferOnce={trackEventHasSeenOfferOnce}
      />
    </Container>
  )
}

const Container = styled.View({
  flex: 1,
})

const ScrollViewContainer = styled(IOScrollView)({})

const InfoContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
