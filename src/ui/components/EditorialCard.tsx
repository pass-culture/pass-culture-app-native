import React, { FunctionComponent, memo } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ImageBackground } from 'libs/resizing-image-on-demand/ImageBackground'
import { ColorScheme } from 'libs/styled/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export type EditorialCardInfo = {
  imageURL: string
  url?: string | null
  date?: string
  title?: string
  subtitle?: string
  callToAction?: string
}

type Props = {
  height: number
  width: number
  isFocus: boolean
  editorialCardInfo: EditorialCardInfo
  accessibilityLabel: string
  onFocus: () => void
  onBlur: () => void
  onPress: () => void
}

const FULL_HEIGHT = { height: '100%' }
const FULL_WIDTH = { width: '100%' }

const EditorialCardComponent: FunctionComponent<Props> = ({
  height,
  width,
  isFocus,
  editorialCardInfo,
  accessibilityLabel,
  onFocus,
  onBlur,
  onPress,
}) => {
  const { imageURL, url, date, title, subtitle, callToAction } = editorialCardInfo
  const isDisabled = !url
  const isLargeScreen = width > 700

  const textComponents = {
    DateText: isLargeScreen ? StyledBody : StyledCaption,
    Title: isLargeScreen ? StyledTitle1 : StyledTitle3,
    Subtitle: isLargeScreen ? StyledTitle4 : StyledCaption,
    CTAText: isLargeScreen ? StyledButtonText : StyledCaption,
  }
  const { DateText, Title, Subtitle, CTAText } = textComponents

  const renderInfos = () => (
    <React.Fragment>
      {date ? (
        <DateText testID="date" numberOfLines={1}>
          {date}
        </DateText>
      ) : null}
      {title ? (
        <Title testID="firstLine" numberOfLines={3} {...getHeadingAttrs(1)}>
          {title}
        </Title>
      ) : null}
      {subtitle ? (
        <Subtitle testID="secondLine" numberOfLines={3} {...getHeadingAttrs(2)}>
          {subtitle}
        </Subtitle>
      ) : null}
      {callToAction ? (
        <Row>
          <CTAText testID="callToAction" numberOfLines={1}>
            {callToAction}
          </CTAText>
          <IconContainer>
            <ArrowRightIcon />
          </IconContainer>
        </Row>
      ) : (
        <BlankSpace />
      )}
    </React.Fragment>
  )

  return (
    <StyledTouchableOpacity
      onFocus={onFocus}
      onBlur={onBlur}
      isFocus={isFocus}
      onPress={onPress}
      accessibilityRole={url ? AccessibilityRole.LINK : undefined}
      accessibilityLabel={accessibilityLabel}
      onMouseDown={(e) => e.preventDefault()}
      disabled={isDisabled}
      height={height}>
      {isLargeScreen ? (
        <FlexRow>
          <ColumnLargeScreen>{renderInfos()}</ColumnLargeScreen>
          <StyledImageBackgroundLargeScreen url={imageURL} height={height} testID="imageBusiness">
            <StyledLinearGradient angle={90} />
          </StyledImageBackgroundLargeScreen>
        </FlexRow>
      ) : (
        <StyledImageBackground url={imageURL} height={height} testID="imageBusiness">
          <StyledLinearGradient angle={0}>
            <Column>{renderInfos()}</Column>
          </StyledLinearGradient>
        </StyledImageBackground>
      )}
    </StyledTouchableOpacity>
  )
}

export const EditorialCard = memo(EditorialCardComponent)

const BlankSpace = styled.View(({ theme }) => ({ height: theme.designSystem.size.spacing.l }))

const FlexRow = styled.View(({ theme }) => {
  const MAIN_MARGIN = theme.designSystem.size.spacing.xl
  return {
    borderRadius: theme.designSystem.size.borderRadius.m,
    flexDirection: 'row',
    width: theme.appContentWidth - 2 * MAIN_MARGIN,
    ...FULL_HEIGHT,
  }
})

const StyledLinearGradient = styled(LinearGradient).attrs<{ angle: number; colors?: string[] }>(
  ({ theme, angle }) => ({
    colors: [theme.designSystem.color.background.lockedInverted, 'transparent'],
    useAngle: true,
    angle,
  })
)({ ...FULL_HEIGHT, ...FULL_WIDTH })

const StyledTouchableOpacity = styled(TouchableOpacity)<{
  onMouseDown: (e: Event) => void
  height: number
  isFocus?: boolean
}>(({ theme, height, isFocus }) => {
  const MAIN_MARGIN = theme.designSystem.size.spacing.xl
  const isDarkMode = theme.colorScheme === ColorScheme.DARK
  return {
    textDecoration: 'none',
    borderRadius: theme.designSystem.size.borderRadius.m,
    height,
    flexWrap: 'wrap',
    overflow: 'hidden',
    marginHorizontal: MAIN_MARGIN,
    marginBottom: theme.home.spaceBetweenModules,
    borderWidth: isDarkMode ? 1 : undefined,
    borderColor: isDarkMode ? theme.designSystem.color.border.subtle : undefined,
    ...customFocusOutline({ theme, isFocus }),
  }
})

const ColumnLargeScreen = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.lockedInverted,
  width: '50%',
  flexDirection: 'column',
  ...FULL_HEIGHT,
  justifyContent: 'flex-end',
  paddingHorizontal: theme.designSystem.size.spacing.l,
}))

const Column = styled.View(({ theme }) => ({
  ...FULL_WIDTH,
  flexDirection: 'column',
  ...FULL_HEIGHT,
  justifyContent: 'flex-end',
  paddingHorizontal: theme.designSystem.size.spacing.l,
}))

const StyledImageBackground = styled(ImageBackground)<{ height: number }>(({ theme, height }) => ({
  height,
  ...FULL_WIDTH,
  borderRadius: theme.designSystem.size.borderRadius.s,
  backgroundColor: theme.designSystem.color.background.brandPrimary,
}))

const StyledImageBackgroundLargeScreen = styled(ImageBackground)<{ height: number }>(({
  height,
  theme,
}) => {
  const MAIN_MARGIN = theme.designSystem.size.spacing.xl
  return {
    height,
    width: (theme.appContentWidth - 2 * MAIN_MARGIN) / 2,
    borderRadius: theme.designSystem.size.borderRadius.s,
    backgroundColor: theme.designSystem.color.background.brandPrimary,
  }
})

const Row = styled.View(({ theme }) => ({
  flexDirection: 'row',
  paddingTop: theme.designSystem.size.spacing.xl,
  gap: theme.designSystem.size.spacing.s,
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const StyledTitle1 = styled(Typo.Title1)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))

const StyledTitle3 = styled(Typo.Title3)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))
const StyledCaption = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))
const StyledTitle4 = styled(Typo.Title4)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))

const StyledButtonText = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
}))

const ArrowRightIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.lockedInverted,
}))({
  flexShrink: 0,
})

const IconContainer = styled.View({
  transform: 'rotate(-45deg)',
})
