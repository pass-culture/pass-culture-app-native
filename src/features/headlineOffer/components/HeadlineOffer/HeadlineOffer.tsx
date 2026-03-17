import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled, { useTheme } from 'styled-components/native'

import { ChronicleCardBody } from 'features/chronicle/components/ChronicleCardBody/ChronicleCardBody'
import { HeadlineOfferData } from 'features/headlineOffer/type'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { getFormattedChronicleDate } from 'shared/chronicle/getFormattedChronicleDate/getFormattedChronicleDate'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalTouchableLinkProps } from 'ui/components/touchableLink/types'
import { Button } from 'ui/designSystem/Button/Button'
import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { PlainMore } from 'ui/svg/icons/PlainMore'

import { HeadlineOfferLargeViewport } from './HeadlineOfferLargeViewport'
import { HeadlineOfferSmallViewport } from './HeadlineOfferSmallViewport'

const HEADLINE_OFFER_LARGE_VIEWPORT = 327
const HEADLINE_OFFER_SMALL_VIEWPORT = 245

type HeadlineOfferProps = HeadlineOfferData &
  Pick<InternalTouchableLinkProps, 'navigateTo' | 'onBeforeNavigate'> & {
    onSeeMoreButtonPress?: (offerId: number) => void
  }

export const HeadlineOffer: FunctionComponent<HeadlineOfferProps> = ({
  navigateTo,
  onBeforeNavigate,
  imageUrl,
  advice,
  onSeeMoreButtonPress,
  ...otherProps
}) => {
  const { isDesktopViewport } = useTheme()
  const HeadlineOfferContent = isDesktopViewport
    ? HeadlineOfferLargeViewport
    : HeadlineOfferSmallViewport
  return (
    <React.Fragment>
      <Container navigateTo={navigateTo} onBeforeNavigate={onBeforeNavigate} hasAdvice={!!advice}>
        <BackgroundImage url={imageUrl} />
        <Gradient />
        <StyledView>
          <HeadlineOfferContent imageUrl={imageUrl} {...otherProps} />
        </StyledView>
      </Container>
      {advice ? (
        <AdviceContainer>
          <ChronicleCardBody
            date={getFormattedChronicleDate(advice.publicationDatetime)}
            description={advice.content}
            tag={<Tag variant={TagVariant.PROEDITO} label={`par ${advice.author}`} />}
            shouldTruncate>
            <View>
              <Button
                wording="Voir plus"
                accessibilityLabel={`Voir plus à propos de ${advice.offerName}`}
                onPress={() => onSeeMoreButtonPress?.(advice.offerId)}
                variant="tertiary"
                color="neutral"
                size="small"
                icon={PlainMore}
                iconPosition="left"
              />
            </View>
          </ChronicleCardBody>
        </AdviceContainer>
      ) : null}
    </React.Fragment>
  )
}

const Container = styled(InternalTouchableLink)<{ hasAdvice: boolean }>(({ theme, hasAdvice }) => ({
  borderTopLeftRadius: theme.designSystem.size.borderRadius.l,
  borderTopRightRadius: theme.designSystem.size.borderRadius.l,
  borderBottomLeftRadius: hasAdvice ? undefined : theme.designSystem.size.borderRadius.l,
  borderBottomRightRadius: hasAdvice ? undefined : theme.designSystem.size.borderRadius.l,
  overflow: 'hidden',
  height: theme.isDesktopViewport ? HEADLINE_OFFER_LARGE_VIEWPORT : HEADLINE_OFFER_SMALL_VIEWPORT,
  width: '100%',
  justifyContent: 'end',
  borderColor: theme.designSystem.color.border.subtle,
  borderWidth: 1,
}))

const AdviceContainer = styled.View(({ theme }) => ({
  padding: theme.designSystem.size.spacing.l,
  border: 1,
  borderColor: theme.designSystem.color.border.subtle,
  backgroundColor: theme.designSystem.color.background.default,
  borderBottomLeftRadius: theme.designSystem.size.borderRadius.l,
  borderBottomRightRadius: theme.designSystem.size.borderRadius.l,
}))

const Gradient = styled(LinearGradient).attrs<{ colors?: string[] }>(({ theme }) => ({
  colors: [
    colorAlpha(theme.designSystem.color.background.lockedInverted, 0),
    theme.designSystem.color.background.lockedInverted,
  ],
  locations: [0, 0.6],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
}))({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: '100%',
  width: '100%',
  zIndex: 1,
})

const StyledView = styled.View({
  height: '100%',
  position: 'relative',
  zIndex: 2,
})

const BackgroundImage = styled(FastImage).attrs({
  resizeMode: 'cover',
})({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 0,
})
