import React from 'react'
import styled from 'styled-components/native'

import { OfferName } from 'ui/components/tiles/OfferName'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

interface AttachedCardDisplayProps {
  title: string
  subtitle?: string
  details?: string[]
  LeftImageComponent?: React.FunctionComponent
  rightTagLabel?: string
  bottomRightElement?: React.ReactNode
  accessibilityLabel?: string
  shouldFixHeight?: boolean
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
  accessibilityLabel,
  shouldFixHeight = false,
}: AttachedCardDisplayProps) => {
  return (
    <Container accessibilityLabel={accessibilityLabel} shouldFixHeight={shouldFixHeight}>
      {LeftImageComponent ? (
        <ImageContainer>
          <LeftImageComponent />
        </ImageContainer>
      ) : null}
      <CentralColumn>
        {subtitle ? <TypoDS.BodyAccentXs>{subtitle}</TypoDS.BodyAccentXs> : null}
        <OfferName title={title} />
        {details
          ? details?.map((detail) => <CaptionNeutralInfo key={detail}>{detail}</CaptionNeutralInfo>)
          : null}
      </CentralColumn>
      <RightColumn>
        {rightTagLabel ? (
          <TagWrapper label={rightTagLabel}>
            <TypoDS.BodyAccentXs>{rightTagLabel}</TypoDS.BodyAccentXs>
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

const Container = styled.View<{ shouldFixHeight: boolean }>(({ theme, shouldFixHeight }) => ({
  backgroundColor: theme.colors.white,
  borderRadius: getSpacing(3),
  borderWidth: BORDER_WIDTH,
  borderColor: theme.colors.greyMedium,
  gap: getSpacing(2),
  flexDirection: 'row',
  padding: OFFER_CARD_PADDING,
  flexWrap: 'wrap',
  height: shouldFixHeight ? OFFER_CARD_HEIGHT + 2 * OFFER_CARD_PADDING : 'auto',
}))

const CaptionNeutralInfo = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
