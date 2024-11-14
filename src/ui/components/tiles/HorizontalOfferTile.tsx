import React, { useMemo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useLogClickOnOffer } from 'libs/algolia/analytics/logClickOnOffer'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { useFunctionOnce } from 'libs/hooks'
import { useDistance } from 'libs/location/hooks/useDistance'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useSubcategory } from 'libs/subcategories'
import { useSearchGroupLabel } from 'libs/subcategories/useSearchGroupLabel'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { useNativeCategoryValue } from 'ui/components/tiles/useNativeCategoryValue'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing } from 'ui/theme'
import { TypoDS } from 'ui/theme/designSystemTypographie'

import { HorizontalTile, HorizontalTileProps } from './HorizontalTile'

interface Props extends Partial<HorizontalTileProps> {
  offer: Offer
  subtitles?: string[]
  onPress?: () => void
  analyticsParams: OfferAnalyticsParams
  style?: StyleProp<ViewStyle>
}

export const HorizontalOfferTile = ({
  offer,
  analyticsParams,
  onPress,
  style,
  subtitles,
  ...horizontalTileProps
}: Props) => {
  const { offer: offerDetails, objectID, _geoloc } = offer
  const { subcategoryId, dates, prices, thumbUrl, name } = offerDetails
  const prePopulateOffer = usePrePopulateOffer()
  const distanceToOffer = useDistance(_geoloc)
  const { categoryId, searchGroupName, nativeCategoryId } = useSubcategory(subcategoryId)
  const searchGroupLabel = useSearchGroupLabel(searchGroupName)
  const { logClickOnOffer } = useLogClickOnOffer()

  const timestampsInMillis = dates?.map((timestampInSec) => timestampInSec * 1000)
  const offerId = Number(objectID)

  const formattedDate = formatDates(timestampsInMillis)
  const formattedPrice = getDisplayPrice(prices)
  const nativeCategoryValue = useNativeCategoryValue({ nativeCategoryId })

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.OFFER, {
    ...offerDetails,
    categoryLabel: searchGroupLabel,
    distance: distanceToOffer,
    date: formattedDate,
    price: formattedPrice,
  })

  const generatedSubtitles = useMemo(() => {
    return subtitles ?? [nativeCategoryValue, formattedDate].filter((subtitle) => !!subtitle)
  }, [formattedDate, nativeCategoryValue, subtitles])

  const triggerConsultOfferLogOnce = useFunctionOnce(() =>
    triggerConsultOfferLog({
      offerId,
      ...analyticsParams,
    })
  )

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

    triggerConsultOfferLogOnce()

    if (analyticsParams.from === 'searchresults')
      logClickOnOffer({ objectID, position: analyticsParams.index ?? 0 })
  }

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
      <HorizontalTile
        {...horizontalTileProps}
        categoryId={categoryId}
        title={name}
        imageUrl={thumbUrl}
        distanceToOffer={distanceToOffer}
        price={formattedPrice}>
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
      </HorizontalTile>
    </Container>
  )
}

const Container = styled(InternalTouchableLink)({
  flexDirection: 'row',
  alignItems: 'center',
  outlineOffset: 0,
  gap: getSpacing(4),
})

const Body = styled(TypoDS.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
