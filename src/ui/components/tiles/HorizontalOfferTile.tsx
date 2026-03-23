import { useNavigationState } from '@react-navigation/native'
import React, { useMemo } from 'react'
import { FlexStyle, StyleProp, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { getInteractionTagLabel } from 'features/offer/components/InteractionTag/getInteractionTagLabel'
import { renderInteractionTag } from 'features/offer/components/InteractionTag/InteractionTag'
import { getIsAComingSoonOffer } from 'features/offer/helpers/getIsAComingSoonOffer'
import { logClickOnOffer } from 'libs/algolia/analytics/logClickOnOffer'
import { algoliaAnalyticsSelectors } from 'libs/algolia/store/algoliaAnalyticsStore'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { getDistance } from 'libs/location/getDistance'
import { useLocation } from 'libs/location/location'
import { LocationMode } from 'libs/location/types'
import {
  formatPrice,
  getDisplayedPrice,
  getIfPricesShouldBeFixed,
} from 'libs/parsers/getDisplayedPrice'
import { useSubcategory } from 'libs/subcategories'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { getOfferDates } from 'shared/date/getOfferDates'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { OfferName } from 'ui/components/tiles/OfferName'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { Typo } from 'ui/theme/typography'

import { HorizontalTile, HorizontalTileProps } from './HorizontalTile'

interface Props extends Partial<HorizontalTileProps> {
  offer: Offer
  subtitles?: string[]
  onPress?: () => void
  analyticsParams: OfferAnalyticsParams
  style?: StyleProp<ViewStyle>
  price?: string
  withRightArrow?: boolean
}

export const HorizontalOfferTile = ({
  offer,
  analyticsParams,
  onPress,
  style,
  subtitles,
  price,
  withRightArrow,
  ...horizontalTileProps
}: Props) => {
  const theme = useTheme()
  const { geolocPosition, userLocation, selectedPlace, selectedLocationMode } = useLocation()
  const { offer: offerDetails, objectID, _geoloc } = offer
  const {
    subcategoryId,
    prices,
    thumbUrl,
    name,
    dates,
    releaseDate,
    isDuo,
    bookingAllowedDatetime,
  } = offerDetails
  const routes = useNavigationState((state) => state?.routes)
  const currentRoute = routes?.[routes?.length - 1]?.name

  const { user } = useAuthContext()
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const prePopulateOffer = usePrePopulateOffer()

  const userPosition =
    currentRoute === 'SearchResults' &&
    selectedLocationMode === LocationMode.EVERYWHERE &&
    geolocPosition
      ? geolocPosition
      : userLocation

  const distanceToOffer = getDistance(
    _geoloc,
    {
      userLocation: userPosition,
      selectedPlace,
      selectedLocationMode,
    },
    subcategoryId
  )
  const { categoryId, appLabel } = useSubcategory(subcategoryId)

  const offerId = Number(objectID)

  const formattedDate = getOfferDates({
    subcategoryId,
    dates,
    releaseDate,
  })

  const formattedPrice = getDisplayedPrice(
    prices,
    currency,
    euroToPacificFrancRate,
    formatPrice({
      isFixed: getIfPricesShouldBeFixed(subcategoryId),
      isDuo: !!(isDuo && user?.isBeneficiary),
    })
  )

  const generatedSubtitles = useMemo(() => {
    return subtitles ?? [appLabel, formattedDate].filter((subtitle) => !!subtitle)
  }, [formattedDate, appLabel, subtitles])

  function handlePressOffer() {
    if (!offerId) return
    if (onPress) onPress()
    // We pre-populate the query-cache with the data from the search client for a smooth transition
    prePopulateOffer({
      ...offerDetails,
      categoryId,
      thumbUrl: offerDetails.thumbUrl,
      isDuo: offerDetails.isDuo,
      name: offerDetails.name,
      offerId,
    })

    triggerConsultOfferLog({
      offerId,

      ...analyticsParams,
    })

    if (analyticsParams.from === 'searchresults') {
      const currentQueryID = algoliaAnalyticsSelectors.selectCurrentQueryID()
      void logClickOnOffer({
        objectID,
        position: analyticsParams.index ?? 0,
        queryID: currentQueryID,
      })
    }
  }

  const isAComingSoonOffer = getIsAComingSoonOffer(bookingAllowedDatetime)

  const interactionTag = renderInteractionTag({
    theme,
    isComingSoonOffer: isAComingSoonOffer,
    subcategoryId,
  })

  const interactionTagLabel = getInteractionTagLabel(interactionTag)
  const accessibilityLabel = tileAccessibilityLabel(TileContentType.OFFER, {
    ...offerDetails,
    categoryLabel: appLabel,
    distance: distanceToOffer,
    date: formattedDate,
    price: formattedPrice,
    interactionTagLabel,
  })

  return (
    <Container
      navigateTo={{
        screen: 'Offer',
        params: { id: offerId, from: analyticsParams.from, searchId: analyticsParams.searchId },
        withPush: analyticsParams.from === 'artist',
      }}
      onBeforeNavigate={handlePressOffer}
      accessibilityLabel={accessibilityLabel}
      enableNavigate={!!offerId}
      from={analyticsParams.from}
      style={style}>
      <StyledHorizontalTile {...horizontalTileProps} categoryId={categoryId} imageUrl={thumbUrl}>
        <Row flex={1} gap={16} testID="horizontal_offer_tile">
          <Column flex={1}>
            {distanceToOffer ? (
              <OfferName title={name ?? ''} />
            ) : (
              <Row>
                <OfferNameContainer>
                  <OfferName title={name ?? ''} />
                </OfferNameContainer>
                {withRightArrow ? <RightIcon testID="RightFilled" /> : null}
              </Row>
            )}
            {!!generatedSubtitles?.length &&
              generatedSubtitles?.map((subtitle, index) => (
                <Body
                  ellipsizeMode="tail"
                  numberOfLines={1}
                  testID="native-category-value"
                  key={subtitle ? `${subtitle}_${index}` : index}>
                  {subtitle}
                </Body>
              ))}
            <PriceAndComingSoonTagContainer gap={1}>
              {price ? <Typo.BodyAccentS>{price}</Typo.BodyAccentS> : null}
              {interactionTag ? (
                <React.Fragment>
                  {price ? <Typo.BodyAccentS>{'\u2022'}</Typo.BodyAccentS> : null}
                  {interactionTag}
                </React.Fragment>
              ) : null}
            </PriceAndComingSoonTagContainer>
          </Column>
          {distanceToOffer ? (
            <DistanceTag testID="distance_tag" label={`à ${distanceToOffer}`} />
          ) : null}
        </Row>
      </StyledHorizontalTile>
    </Container>
  )
}

const StyledHorizontalTile = styled(HorizontalTile)({
  flex: 1,
})

const Container = styled(InternalTouchableLink)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  outlineOffset: 0,
  gap: theme.designSystem.size.spacing.l,
}))

const Body = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const Flex = styled.View<FlexStyle>(({ flex, justifyContent, alignItems, gap, flexDirection }) => ({
  flexDirection,
  flex,
  alignItems,
  justifyContent,
  gap,
}))

const Column = Flex

const Row = styled(Flex).attrs({
  flexDirection: 'row',
  alignItems: 'center',
})``

const OfferNameContainer = styled.View({
  flexShrink: 1,
})

const RightIcon = styled(RightFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  marginLeft: theme.designSystem.size.spacing.xs,
}))({
  flexShrink: 0,
})

const DistanceTag = styled(Tag)(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.subtle,
}))

const PriceAndComingSoonTagContainer = styled(ViewGap)({
  flexDirection: 'row',
})
