import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { getTagColor } from 'features/home/components/helpers/getTagColor'
import { formatDates, getDisplayPrice } from 'libs/parsers'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { styledButton } from 'ui/components/buttons/styledButton'
import { ImageTile } from 'ui/components/ImageTile'
import { Touchable } from 'ui/components/touchable/Touchable'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Typo, getSpacing } from 'ui/theme'

const OFFER_HEIGHT = getSpacing(28)
const OFFER_WIDTH = getSpacing(20)

type Props = {
  offer: Offer
  color: string
  hideModal: () => void
}

export const OfferVideoModule: FunctionComponent<Props> = ({ offer, color, hideModal }) => {
  const timestampsInMillis = offer.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
  const labelMapping = useCategoryHomeLabelMapping()
  const mapping = useCategoryIdMapping()

  const prePopulateOffer = usePrePopulateOffer()

  const categoryId = mapping[offer.offer.subcategoryId]

  return (
    <OfferInsert
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
      }}>
      <Row>
        <OfferImage>
          <ImageTile width={OFFER_WIDTH} height={OFFER_HEIGHT} uri={offer.offer.thumbUrl} />
        </OfferImage>
        <OfferInformations>
          <CategoryText color={color}>{labelMapping[offer.offer.subcategoryId]}</CategoryText>
          <TitleText numberOfLines={2}>{offer.offer.name}</TitleText>
          <AdditionalInfoText>{formatDates(timestampsInMillis)}</AdditionalInfoText>
          <AdditionalInfoText>{getDisplayPrice(offer?.offer?.prices)}</AdditionalInfoText>
        </OfferInformations>
      </Row>
      <ArrowOffer>
        <PlainArrowNext />
      </ArrowOffer>
    </OfferInsert>
  )
}

const OfferInsert = styled(InternalTouchableLink)(({ theme }) => ({
  // the overflow: hidden allow to add border radius to the image
  // https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  backgroundColor: theme.colors.white,
  alignItems: 'flex-start',
  border: 1,
  borderColor: theme.colors.greyMedium,
}))

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const OfferInformations = styled.View({
  flex: 1,
  marginRight: getSpacing(4),
})
const OfferImage = styled.View({
  margin: getSpacing(4),
})

const ArrowOffer = styledButton(Touchable)({
  position: 'absolute',
  bottom: getSpacing(4),
  right: getSpacing(4),
})

const CategoryText = styled(Typo.Caption)<{ color: string }>(({ color }) => ({
  color: getTagColor(color),
  marginBottom: getSpacing(1),
}))

const TitleText = styled(Typo.ButtonText)({
  marginBottom: getSpacing(1),
})

const AdditionalInfoText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
  marginBottom: getSpacing(1),
}))
