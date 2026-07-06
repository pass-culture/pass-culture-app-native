import React, { FunctionComponent, ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { ColorScheme } from 'libs/styled/types'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type ActionCardLayout = 'split' | 'overlay'

type Props = {
  height: number
  width: number
  isFocus: boolean
  url?: string | null
  date?: string
  title?: string
  subtitle?: string
  callToAction?: string
  accessibilityLabel: string
  visual: ReactNode
  backgroundColor?: string
  desktopLayout: ActionCardLayout
  onFocus: () => void
  onBlur: () => void
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

const FULL_HEIGHT = { height: '100%' }
const FULL_WIDTH = { width: '100%' }

export const ActionCardBase: FunctionComponent<Props> = ({
  height,
  width,
  isFocus,
  url,
  date,
  title,
  subtitle,
  callToAction,
  accessibilityLabel,
  visual,
  backgroundColor,
  desktopLayout,
  onFocus,
  onBlur,
  onPress,
  style,
}) => {
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
      height={height}
      style={style}>
      {isLargeScreen && desktopLayout === 'split' ? (
        <FlexRow>
          <ColumnLargeScreen>{renderInfos()}</ColumnLargeScreen>
          <ImageContainerLargeScreen
            accessible={false}
            height={height}
            backgroundColor={backgroundColor}
            testID="imageBusiness">
            {visual}
            <StyledLinearGradient angle={90} />
          </ImageContainerLargeScreen>
        </FlexRow>
      ) : (
        <ImageContainer
          accessible={false}
          height={height}
          backgroundColor={backgroundColor}
          testID="imageBusiness">
          {visual}
          <StyledLinearGradient angle={isLargeScreen ? 90 : 0}>
            {isLargeScreen ? (
              <ColumnLargeScreenOverlay>{renderInfos()}</ColumnLargeScreenOverlay>
            ) : (
              <Column>{renderInfos()}</Column>
            )}
          </StyledLinearGradient>
        </ImageContainer>
      )}
    </StyledTouchableOpacity>
  )
}

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
    borderWidth: isDarkMode ? 1 : undefined,
    borderColor: isDarkMode ? theme.designSystem.color.border.subtle : undefined,
    ...customFocusOutline({ theme, isFocus }),
  }
})

const ImageContainer = styled.View<{ height: number; backgroundColor?: string }>(
  ({ theme, height, backgroundColor }) => ({
    height,
    ...FULL_WIDTH,
    borderRadius: theme.designSystem.size.borderRadius.s,
    backgroundColor: backgroundColor ?? theme.designSystem.color.background.brandPrimary,
    overflow: 'hidden',
  })
)

const ImageContainerLargeScreen = styled(ImageContainer)(({ theme }) => {
  const MAIN_MARGIN = theme.designSystem.size.spacing.xl
  return {
    width: (theme.appContentWidth - 2 * MAIN_MARGIN) / 2,
  }
})

const StyledLinearGradient = styled(LinearGradient).attrs<{ angle: number; colors?: string[] }>(
  ({ theme, angle }) => ({
    colors: [theme.designSystem.color.background.lockedInverted, 'transparent'],
    useAngle: true,
    angle,
  })
)({ ...FULL_HEIGHT, ...FULL_WIDTH })

const ColumnLargeScreen = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.lockedInverted,
  width: '50%',
  flexDirection: 'column',
  ...FULL_HEIGHT,
  justifyContent: 'flex-end',
  paddingHorizontal: theme.designSystem.size.spacing.l,
}))

const ColumnLargeScreenOverlay = styled(ColumnLargeScreen)({
  backgroundColor: 'transparent',
})

const Column = styled.View(({ theme }) => ({
  ...FULL_WIDTH,
  flexDirection: 'column',
  ...FULL_HEIGHT,
  justifyContent: 'flex-end',
  paddingHorizontal: theme.designSystem.size.spacing.l,
}))

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
  size: theme.designSystem.size.icon.s,
  color: theme.designSystem.color.icon.lockedInverted,
}))({
  flexShrink: 0,
})

const IconContainer = styled.View({
  transform: 'rotate(-45deg)',
})
