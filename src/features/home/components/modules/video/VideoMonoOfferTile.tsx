import React, { FunctionComponent } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { getTagColor } from 'features/home/components/helpers/getTagColor'
import { analytics } from 'libs/analytics'
import { ConsultOfferAnalyticsParams } from 'libs/analytics/types'
import { formatDates, getDisplayPrice } from 'libs/parsers'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { usePrePopulateOffer } from 'shared/offer/usePrePopulateOffer'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { Typo, getSpacing } from 'ui/theme'

type Props = {
  offer: Offer
  color: string
  hideModal: () => void
  analyticsParams: ConsultOfferAnalyticsParams
  style?: StyleProp<ViewStyle>
}

export const VideoMonoOfferTile: FunctionComponent<Props> = ({
  offer,
  color,
  hideModal,
  analyticsParams,
  style,
}) => {
  const timestampsInMillis = offer.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
  const labelMapping = useCategoryHomeLabelMapping()
  const mapping = useCategoryIdMapping()
  const displayDate = formatDates(timestampsInMillis)
  const displayPrice = getDisplayPrice(offer?.offer?.prices)

  const prePopulateOffer = usePrePopulateOffer()

  const theme = useTheme()

  const offerHeight = theme.isDesktopViewport ? getSpacing(45) : getSpacing(35)

  const categoryId = mapping[offer.offer.subcategoryId]

  return (
    <OfferInsert
      offerHeight={offerHeight}
      style={style}
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
      }}>
      <Row>
        <OfferImageContainer>
          <OfferImage
            imageUrl={offer.offer.thumbUrl}
            categoryId={categoryId}
            size={theme.isDesktopViewport ? 'large' : 'medium'}
          />
        </OfferImageContainer>
        <OfferInformations>
          <CategoryText color={color}>{labelMapping[offer.offer.subcategoryId]}</CategoryText>
          <TitleText numberOfLines={2}>{offer.offer.name}</TitleText>
          {!!displayDate && <AdditionalInfoText>{displayDate}</AdditionalInfoText>}
          {!!displayPrice && <AdditionalInfoText>{displayPrice}</AdditionalInfoText>}
        </OfferInformations>
      </Row>
      <ArrowOffer>
        <PlainArrowNext />
      </ArrowOffer>
    </OfferInsert>
  )
}

const OfferInsert = styled(InternalTouchableLink)<{ offerHeight: number }>(
  ({ theme, offerHeight }) => ({
    // the overflow: hidden allow to add border radius to the image
    // https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
    overflow: 'hidden',
    borderRadius: theme.borderRadius.radius,
    backgroundColor: theme.colors.white,
    height: offerHeight,
    alignItems: 'flex-start',
    border: 1,
    borderColor: theme.colors.greyMedium,
  })
)

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const OfferInformations = styled.View({
  flex: 1,
  marginRight: getSpacing(4),
})

const OfferImageContainer = styled.View({
  margin: getSpacing(4),
})

const ArrowOffer = styled.View({
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
