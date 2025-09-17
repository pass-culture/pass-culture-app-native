import React from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum } from 'api/gen'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { OfferName } from 'ui/components/tiles/OfferName'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { getSpacing, Typo } from 'ui/theme'

export type LeftImageComponentProps = {
  imageUrl?: string
  categoryId?: CategoryIdEnum | null
}
interface AttachedCardDisplayProps {
  title: string
  subtitle?: string
  details?: string[]
  LeftImageComponent?: React.ComponentType<LeftImageComponentProps>
  leftImageProps?: LeftImageComponentProps
  rightTagLabel?: string
  bottomRightElement?: React.ReactNode
  accessibilityLabel?: string
  shouldFixHeight?: boolean
  bottomBannerText?: string
}

const BORDER_WIDTH = getSpacing(0.25)
const OFFER_CARD_HEIGHT = getSpacing(25)
const OFFER_CARD_PADDING = getSpacing(4)
const BORDER_RADIUS = getSpacing(3)

export const AttachedCardDisplay: React.FC<AttachedCardDisplayProps> = ({
  title,
  subtitle,
  details,
  LeftImageComponent,
  leftImageProps,
  rightTagLabel,
  bottomRightElement,
  accessibilityLabel,
  bottomBannerText,
  shouldFixHeight = false,
}: AttachedCardDisplayProps) => {
  return (
    <React.Fragment>
      <Container
        accessibilityLabel={accessibilityLabel}
        shouldFixHeight={shouldFixHeight}
        bottomBannerText={bottomBannerText}>
        {LeftImageComponent ? (
          <ImageContainer>
            <LeftImageComponent {...leftImageProps} />
          </ImageContainer>
        ) : null}
        <CentralColumn>
          {subtitle ? <Typo.BodyAccentXs>{subtitle}</Typo.BodyAccentXs> : null}
          <OfferName title={title} />
          {details
            ? details?.map((detail) => (
                <StyledBodyAccentXs key={detail}>{detail}</StyledBodyAccentXs>
              ))
            : null}
        </CentralColumn>
        <RightColumn
          hasRightTagLabel={!!rightTagLabel}
          hasBottomRightElement={!!bottomRightElement}>
          {rightTagLabel ? <Tag label={rightTagLabel} variant={TagVariant.DEFAULT} /> : null}
          {bottomRightElement ? (
            <BottomRightElementContainer>{bottomRightElement}</BottomRightElementContainer>
          ) : null}
        </RightColumn>
      </Container>
      {bottomBannerText ? (
        <BottomBanner>
          <ClockFilled />
          <Typo.BodyAccentXs>{bottomBannerText}</Typo.BodyAccentXs>
        </BottomBanner>
      ) : null}
    </React.Fragment>
  )
}

const BottomBanner = styled.View(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.l,
  paddingVertical: theme.designSystem.size.spacing.s,
  height: theme.designSystem.size.spacing.xxxl,
  gap: theme.designSystem.size.spacing.s,
  backgroundColor: theme.designSystem.color.background.warning,
  borderBottomLeftRadius: BORDER_RADIUS,
  borderBottomRightRadius: BORDER_RADIUS,
  flexDirection: 'row',
  alignItems: 'center',
}))

const CentralColumn = styled.View(({ theme }) => ({
  flexDirection: 'column',
  flex: 1,
  textAlign: 'left',
  gap: theme.designSystem.size.spacing.xs,
  wordWrap: 'break-word',
  justifyContent: 'center',
}))

const RightColumn = styled.View<{ hasRightTagLabel: boolean; hasBottomRightElement: boolean }>(
  ({ hasRightTagLabel, hasBottomRightElement }) => {
    let justifyContent: 'space-between' | 'flex-start' | 'flex-end'

    if (hasRightTagLabel && hasBottomRightElement) {
      justifyContent = 'space-between'
    } else if (hasRightTagLabel) {
      justifyContent = 'flex-start'
    } else {
      justifyContent = 'flex-end'
    }

    return {
      alignItems: 'flex-end',
      marginVertical: getSpacing(0.25),
      justifyContent,
    }
  }
)

const ImageContainer = styled.View({
  justifyContent: 'center',
  flexDirection: 'column',
})

const Container = styled.View<{ shouldFixHeight: boolean; bottomBannerText?: string }>(
  ({ theme, shouldFixHeight, bottomBannerText }) => ({
    backgroundColor: theme.designSystem.color.background.default,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    borderBottomLeftRadius: bottomBannerText ? 0 : BORDER_RADIUS,
    borderBottomRightRadius: bottomBannerText ? 0 : BORDER_RADIUS,
    borderWidth: BORDER_WIDTH,
    borderColor: theme.designSystem.color.border.subtle,
    gap: getSpacing(2),
    flexDirection: 'row',
    padding: OFFER_CARD_PADDING,
    flexWrap: 'wrap',
    height: shouldFixHeight ? OFFER_CARD_HEIGHT + 2 * OFFER_CARD_PADDING : 'auto',
  })
)

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const BottomRightElementContainer = styled.View({
  marginTop: getSpacing(1),
})
