// eslint-disable-next-line no-restricted-imports
import FastImage from '@d11/react-native-fast-image'
import React, { FunctionComponent } from 'react'
import { Animated } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { SubscribeButtonWithModals } from 'features/home/components/SubscribeButtonWithModals'
import { getCategoryHeaderBackgroundColor } from 'features/home/helpers/getCategoryColor'
import { CategoryThematicHeader } from 'features/home/types'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { getSpacing, Typo } from 'ui/theme'

export const CATEGORY_HEADER_HEIGHT = 53
const CATEGORY_HEADER_ILLUSTRATION_WIDTH = getSpacing(80)
const CATEGORY_HEADER_ILLUSTRATION_ASPECT_RATIO = 3 / 2
const CATEGORY_HEADER_TEXT_MAX_WIDTH = '58%'

type Props = Omit<CategoryThematicHeader, 'type'> & {
  homeId: string
}

export const CategoryThematicHomeHeaderContent: FunctionComponent<Props> = ({
  title,
  titleParts,
  subtitle,
  imageUrl,
  color,
  gradientTranslation,
  homeId,
}) => {
  const { designSystem } = useTheme()
  const backgroundColor = getCategoryHeaderBackgroundColor(color, designSystem.color.illustration)
  const shouldUseAccessibleLayout = useMobileFontScaleToDisplay({
    default: false,
    at200PercentZoom: true,
  })
  const titlePartsToDisplay = shouldUseAccessibleLayout ? [title] : (titleParts ?? [title])

  return (
    <Container backgroundColor={backgroundColor} testID="CategoryThematicHomeHeaderV2">
      {imageUrl && !shouldUseAccessibleLayout ? (
        <AnimatedIllustration
          accessible={false}
          source={{ uri: imageUrl }}
          resizeMode="contain"
          testID="categoryHeaderIllustration"
        />
      ) : null}
      <AnimatedContent style={{ transform: [{ translateY: gradientTranslation || 0 }] }}>
        <TextContainer>
          {subtitle ? <Subtitle numberOfLines={1}>{subtitle}</Subtitle> : null}
          <TitleContainer accessibilityLabel={title}>
            {titlePartsToDisplay.map((titlePart, index) => (
              <Title key={`${titlePart}-${index}`} numberOfLines={1}>
                {titlePart}
              </Title>
            ))}
          </TitleContainer>
        </TextContainer>
        <SubscribeButtonContainer>
          <SubscribeButtonWithModals homeId={homeId} />
        </SubscribeButtonContainer>
      </AnimatedContent>
    </Container>
  )
}

const Container = styled.View<{ backgroundColor: string }>(({ backgroundColor }) => ({
  height: getSpacing(CATEGORY_HEADER_HEIGHT),
  backgroundColor,
  overflow: 'hidden',
}))

const Illustration = styled(FastImage)({
  position: 'absolute',
  top: 0,
  right: 0,
  width: CATEGORY_HEADER_ILLUSTRATION_WIDTH,
  aspectRatio: CATEGORY_HEADER_ILLUSTRATION_ASPECT_RATIO,
})

const AnimatedIllustration = Animated.createAnimatedComponent(Illustration)

const AnimatedContent = styled(Animated.View)(({ theme }) => ({
  position: 'absolute',
  right: theme.designSystem.size.spacing.xl,
  bottom: theme.designSystem.size.spacing.xl,
  left: theme.designSystem.size.spacing.xl,
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: theme.designSystem.size.spacing.s,
}))

const TextContainer = styled.View({
  flexShrink: 1,
  maxWidth: CATEGORY_HEADER_TEXT_MAX_WIDTH,
  alignItems: 'flex-start',
})

const TitleContainer = styled.View(({ theme }) => ({
  alignItems: 'flex-start',
  gap: theme.designSystem.size.spacing.xs,
  maxWidth: '100%',
  transform: 'rotate(-3deg)',
}))

const Title = styled(Typo.Title3)(({ theme }) => ({
  color: theme.designSystem.color.text.default,
  backgroundColor: theme.designSystem.color.background.default,
  borderRadius: theme.designSystem.size.borderRadius.s,
  maxWidth: '100%',
  paddingHorizontal: theme.designSystem.size.spacing.xs,
  paddingVertical: theme.designSystem.size.spacing.xxs,
}))

const Subtitle = styled(Typo.Title4)(({ theme }) => ({
  color: theme.designSystem.color.text.default,
  backgroundColor: theme.designSystem.color.background.default,
  borderRadius: theme.designSystem.size.borderRadius.s,
  marginBottom: theme.designSystem.size.spacing.xs,
  maxWidth: '100%',
  paddingHorizontal: theme.designSystem.size.spacing.xs,
  paddingVertical: theme.designSystem.size.spacing.xxs,
}))

const SubscribeButtonContainer = styled.View({
  flexShrink: 0,
})
