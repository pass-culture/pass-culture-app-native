import React from 'react'
import styled from 'styled-components/native'

import { OfferName } from 'ui/components/tiles/OfferName'
import { getShadow, getSpacing, Spacer, Typo } from 'ui/theme'

interface AttachedCardDisplayProps {
  title: string
  subtitle?: string
  details?: string[]
  LeftImageComponent?: React.FunctionComponent
  rightTagLabel?: string
  bottomRightElement?: React.ReactNode
}

const BORDER_WIDTH = getSpacing(0.25)
const OFFER_CARD_HEIGHT = getSpacing(25)
const OFFER_CARD_PADDING = getSpacing(4)

export const AttachedCardDisplay: React.FC<AttachedCardDisplayProps> = ({
  title,
  subtitle,
  details,
  LeftImageComponent,
  rightTagLabel,
  bottomRightElement,
}: AttachedCardDisplayProps) => {
  return (
    <Container>
      {LeftImageComponent ? (
        <ImageContainer>
          <LeftImageComponent />
        </ImageContainer>
      ) : null}
      <CentralColumn>
        {subtitle ? <Typo.Caption>{subtitle}</Typo.Caption> : null}
        <OfferName title={title} />
        {details
          ? details?.map((detail) => (
              <Typo.CaptionNeutralInfo key={detail}>{detail}</Typo.CaptionNeutralInfo>
            ))
          : null}
      </CentralColumn>
      <RightColumn>
        {rightTagLabel ? (
          <TagWrapper label={rightTagLabel}>
            <Typo.Hint>{rightTagLabel}</Typo.Hint>
          </TagWrapper>
        ) : null}
        <Spacer.Flex />
        {bottomRightElement ? (
          <React.Fragment>
            <Spacer.Row numberOfSpaces={1} />
            {bottomRightElement}
          </React.Fragment>
        ) : null}
      </RightColumn>
    </Container>
  )
}

const TagWrapper = styled.View(({ theme }) => ({
  borderRadius: theme.tiles.borderRadius,
  backgroundColor: theme.colors.greyLight,
  paddingVertical: getSpacing(0.5),
  paddingHorizontal: getSpacing(1),
  alignSelf: 'baseline',
}))

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

const ImageContainer = styled.View({
  justifyContent: 'center',
})

const Container = styled.View(({ theme }) => ({
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
}))
