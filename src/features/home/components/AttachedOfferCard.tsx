import React from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { useDistance } from 'libs/location/hooks/useDistance'
import { OfferLocation } from 'shared/offer/types'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { OfferName } from 'ui/components/tiles/OfferName'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { Spacer, getSpacing, Typo, getShadow } from 'ui/theme'
import { CaptionNeutralInfo } from 'ui/theme/typography'

const BORDER_WIDTH = getSpacing(0.25)
const OFFER_CARD_HEIGHT = getSpacing(25)
const OFFER_CARD_PADDING = getSpacing(4)

export type AttachedOfferCardProps = {
  title: string
  categoryId: CategoryIdEnum | null
  categoryText: string
  offerLocation?: OfferLocation
  imageUrl?: string
  showImage?: boolean
  price?: string
  withRightArrow?: boolean
  date?: string
  fixedHeight?: boolean
}

export const AttachedOfferCard = ({
  title,
  categoryId,
  imageUrl,
  offerLocation,
  price,
  categoryText,
  date,
  withRightArrow,
  showImage,
  fixedHeight,
}: AttachedOfferCardProps) => {
  const distanceToOffer = useDistance(offerLocation || { lat: 0, lng: 0 })

  return (
    <Container fixedHeight={fixedHeight}>
      {showImage ? (
        <ImageContainer>
          <OfferImage
            imageUrl={imageUrl}
            categoryId={categoryId}
            borderRadius={getSpacing(1.25)}
            withStroke
          />
        </ImageContainer>
      ) : null}
      <CentralColumn>
        <Typo.Caption>{categoryText}</Typo.Caption>
        <OfferName title={title} />
        {date ? <CaptionNeutralInfo>{date}</CaptionNeutralInfo> : null}
        {price ? <CaptionNeutralInfo>{price}</CaptionNeutralInfo> : null}
      </CentralColumn>
      <RightColumn>
        {distanceToOffer ? (
          <DistanceWrapper label={`à ${distanceToOffer}`}>
            <Typo.Hint>à {distanceToOffer}</Typo.Hint>
          </DistanceWrapper>
        ) : null}
        <Spacer.Flex />
        {withRightArrow ? (
          <React.Fragment>
            <Spacer.Row numberOfSpaces={1} />
            <ArrowRightIcon />
          </React.Fragment>
        ) : null}
      </RightColumn>
    </Container>
  )
}

const DistanceWrapper = styled.View(({ theme }) => ({
  borderRadius: theme.tiles.borderRadius,
  backgroundColor: theme.colors.greyLight,
  paddingVertical: getSpacing(0.5),
  paddingHorizontal: getSpacing(1),
  alignSelf: 'baseline',
}))

const ArrowRightIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))({
  flexShrink: 0,
})

const ImageContainer = styled.View({
  justifyContent: 'center',
})

const CentralColumn = styled.View({
  flexDirection: 'column',
  flex: 1,
  textAlign: 'left',
  gap: getSpacing(1),
  wordWrap: 'break-word',
  justifyContent: 'center',
})

const RightColumn = styled.View({
  alignItems: 'flex-end',
  marginVertical: getSpacing(0.25),
})

const Container = styled.View<{ fixedHeight: boolean }>(({ theme, fixedHeight }) => ({
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(3),
    },
    shadowRadius: getSpacing(12),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
  }),
  backgroundColor: theme.colors.white,
  borderRadius: getSpacing(3),
  borderWidth: BORDER_WIDTH,
  borderColor: theme.colors.greyMedium,
  gap: getSpacing(2),
  flexDirection: 'row',
  padding: OFFER_CARD_PADDING,
  maxHeight: OFFER_CARD_HEIGHT + 2 * OFFER_CARD_PADDING,
  flexWrap: 'wrap',
  ...(fixedHeight ? { height: OFFER_CARD_HEIGHT + 2 * OFFER_CARD_PADDING } : {}),
}))
