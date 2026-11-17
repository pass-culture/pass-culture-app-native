import React from 'react'
import styled from 'styled-components/native'

import { buildProductionOfferUrl } from 'cheatcodes/pages/features/conversationalSearch/constants'
import { getDisplayedPrice } from 'libs/parsers/getDisplayedPrice'
import { useSubcategory } from 'libs/subcategories'
import { tileAccessibilityLabel, TileContentType } from 'libs/tileAccessibilityLabel'
import { usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { useNumberOfLine } from 'shared/accessibility/helpers/zoomHelpers'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { getOfferDates } from 'shared/date/getOfferDates'
import { Offer } from 'shared/offer/types'
import { HorizontalTile } from 'ui/components/tiles/HorizontalTile'
import { OfferName } from 'ui/components/tiles/OfferName'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Typo } from 'ui/theme'

type Props = {
  offer: Offer
}

export const ConversationalSearchOfferCard = ({ offer }: Props) => {
  const { objectID, offer: offerDetails, venue } = offer
  const { subcategoryId, name, prices, dates, releaseDate, thumbUrl, isDuo } = offerDetails

  const { categoryId, appLabel } = useSubcategory(subcategoryId)
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const numberOfLines = useNumberOfLine(1)

  const formattedDate = getOfferDates({ subcategoryId, dates, releaseDate })
  const formattedPrice = getDisplayedPrice(prices, currency, euroToPacificFrancRate)
  const venueLabel = [venue.publicName || venue.name, venue.city].filter(Boolean).join(', ')
  const subtitles = [appLabel, venueLabel, formattedDate].filter(
    (subtitle): subtitle is string => !!subtitle
  )

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.OFFER, {
    name,
    categoryLabel: appLabel,
    price: formattedPrice,
    date: formattedDate,
    isDuo,
  })

  return (
    <ExternalTouchableLink
      externalNav={{ url: buildProductionOfferUrl(objectID), params: { shouldLogEvent: false } }}
      accessibilityLabel={accessibilityLabel}>
      <HorizontalTile categoryId={categoryId} imageUrl={thumbUrl}>
        <Column>
          <OfferName title={name ?? ''} />
          {subtitles.map((subtitle) => (
            <Typo.Body key={subtitle} ellipsizeMode="tail" numberOfLines={numberOfLines}>
              {subtitle}
            </Typo.Body>
          ))}
          <Typo.BodyAccentS>{formattedPrice}</Typo.BodyAccentS>
        </Column>
      </HorizontalTile>
    </ExternalTouchableLink>
  )
}

const Column = styled.View({
  flex: 1,
})
