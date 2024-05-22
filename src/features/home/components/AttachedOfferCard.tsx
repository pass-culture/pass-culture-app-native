import React from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { OfferImage } from 'ui/components/tiles/OfferImage'
import { OfferName } from 'ui/components/tiles/OfferName'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { Spacer, getSpacing, Typo, getShadow } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { CaptionNeutralInfo } from 'ui/theme/typography'

const BORDER_WIDTH = getSpacing(0.25)
const OFFER_CARD_HEIGHT = getSpacing(25)
const OFFER_CARD_PADDING = getSpacing(4)

type AttachedOfferCardProps = {
  title: string
  categoryId: CategoryIdEnum
  imageUrl?: string
  showImage?: boolean
  distanceToOffer?: string
  price?: string
  withRightArrow?: boolean
  onPress: () => void
  tag: string
  date?: string
}

export const AttachedOfferCard = ({
  title,
  categoryId,
  imageUrl,
  distanceToOffer,
  price,
  tag,
  date,
  withRightArrow,
  onPress,
  showImage,
}: AttachedOfferCardProps) => {
  const focusProps = useHandleFocus()

  return (
    <Container
      onPress={onPress}
      accessibilityLabel={`Carte offre ${title}`}
      {...focusProps}
      onMouseDown={(e) => e.preventDefault()}>
      {showImage ? (
        <OfferImage
          imageUrl={imageUrl}
          categoryId={categoryId}
          borderRadius={getSpacing(1.39)}
          withStroke
        />
      ) : null}
      <CentralColumn>
        <Typo.Caption>{tag}</Typo.Caption>
        <OfferName title={title} />
        {date ? <CaptionNeutralInfo>{date}</CaptionNeutralInfo> : null}
        {price ? <CaptionNeutralInfo>{price}</CaptionNeutralInfo> : null}
      </CentralColumn>
      <RightColumn>
        {distanceToOffer ? (
          <DistanceWrapper label={`à ${distanceToOffer}`}>
            <Typo.Hint>{distanceToOffer}</Typo.Hint>
          </DistanceWrapper>
        ) : null}
        {withRightArrow ? (
          <React.Fragment>
            <Spacer.Row numberOfSpaces={1} />
            <ArrowRighIcon testID="ArrowRighIcon" />
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

const ArrowRighIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))({
  flexShrink: 0,
})

const CentralColumn = styled.View({
  flexDirection: 'column',
  flex: 1,
  textAlign: 'left',
  gap: getSpacing(1),
  wordWrap: 'break-word',
})

const RightColumn = styled.View({
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  height: '100%',
})

const Container = styled(TouchableOpacity)<{
  onMouseDown: (e: Event) => void
  isFocus?: boolean
}>(({ theme, isFocus }) => ({
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
  alignItems: 'center',
  padding: OFFER_CARD_PADDING,
  maxHeight: OFFER_CARD_HEIGHT + 2 * OFFER_CARD_PADDING,
  flexWrap: 'wrap',
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))
