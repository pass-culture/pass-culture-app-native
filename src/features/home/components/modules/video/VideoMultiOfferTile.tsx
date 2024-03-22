import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { analytics } from 'libs/analytics'
import { OfferAnalyticsParams } from 'libs/analytics/types'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { Spacer, Typo, getSpacing } from 'ui/theme'

type Props = {
  offer: Offer
  hideModal: () => void
  analyticsParams: OfferAnalyticsParams
}

export const VideoMultiOfferTile: FunctionComponent<Props> = ({
  offer,
  hideModal,
  analyticsParams,
}) => {
  const labelMapping = useCategoryHomeLabelMapping()
  const mapping = useCategoryIdMapping()
  const displayPrice = getDisplayPrice(offer?.offer?.prices)

  const prePopulateOffer = usePrePopulateOffer()

  const categoryId = mapping[offer.offer.subcategoryId]

  return (
    <Container>
      <StyledTouchableLink
        navigateTo={{
          screen: 'Offer',
          params: { id: +offer.objectID },
        }}
        onBeforeNavigate={() => {
          hideModal()
          prePopulateOffer({
            ...offer.offer,
            offerId: +offer.objectID,
            categoryId,
          })
          analytics.logConsultOffer({
            offerId: +offer.objectID,
            ...analyticsParams,
          })
        }}
        testId="multi-offer-tile">
        <OfferImage
          imageUrl={offer.offer.thumbUrl}
          categoryId={categoryId}
          size="large"
          borderRadius={getSpacing(2)}
          withStroke
        />
        <Spacer.Column numberOfSpaces={2} />
        <Typo.Caption numberOfLines={1}>{offer.offer.name}</Typo.Caption>
        <AdditionalInfoText>{labelMapping[offer.offer.subcategoryId]}</AdditionalInfoText>
        {!!displayPrice && <AdditionalInfoText>{displayPrice}</AdditionalInfoText>}
      </StyledTouchableLink>
    </Container>
  )
}

const Container = styled(View)(({ theme }) => ({
  backgroundColor: theme.colors.white,
  borderRadius: getSpacing(2),
}))

const StyledTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  width: theme.tiles.sizes['large'].width,
}))

const AdditionalInfoText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
