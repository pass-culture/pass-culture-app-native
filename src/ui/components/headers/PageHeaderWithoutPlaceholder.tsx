import colorAlpha from 'color-alpha'
import React, { FunctionComponent, ReactNode } from 'react'
import { Platform, StyleProp, View, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { HEADER_HEIGHT } from 'shared/header/useGetHeaderHeight'
import { BACK_BUTTON_MAX_SIZE, BackButton } from 'ui/components/headers/BackButton'
import { Spacer, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  title?: string
  titleID?: string
  onGoBack?: () => void
  testID?: string
  shouldDisplayBackButton?: boolean
  RightButton?: ReactNode
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

// Component naming: this component needs to be used with a PlaceHolder component
// that has the height of the header as it is an absolute view
export const PageHeaderWithoutPlaceholder: FunctionComponent<Props> = ({
  title,
  titleID,
  onGoBack,
  testID,
  shouldDisplayBackButton = true,
  RightButton = null,
  children,
  style,
}) => {
  const { designSystem } = useTheme()
  return (
    <Header testID={testID} accessibilityRole={AccessibilityRole.HEADER} style={style}>
      <Spacer.TopScreen />
      <Container>
        <ButtonContainer positionInHeader="left" testID="back-button-container">
          {shouldDisplayBackButton ? (
            <BackButton onGoBack={onGoBack} color={designSystem.color.icon.default} />
          ) : null}
        </ButtonContainer>
        {title ? (
          <TitleContainer>
            <Title nativeID={titleID}>{title}</Title>
          </TitleContainer>
        ) : null}
        <ButtonContainer positionInHeader="right" testID="close-button-container">
          {RightButton}
        </ButtonContainer>
      </Container>
      {children}
    </Header>
  )
}

const Header = styled(View)(({ theme }) => ({
  zIndex: theme.zIndex.header,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  // There is an issue with the blur on Android: we chose to render white background for the header
  backgroundColor:
    Platform.OS === 'android'
      ? theme.designSystem.color.background.default
      : colorAlpha(theme.designSystem.color.background.default, 0),
  borderBottomColor: theme.designSystem.separator.color.subtle,
  borderBottomWidth: 1,
}))

const TitleContainer = styled.View({
  flexShrink: 1,
})

const Title = styled(Typo.Title4).attrs(() => ({
  numberOfLines: 2,
  ...getHeadingAttrs(1),
}))({
  textAlign: 'center',
})

const Container = styled.View(({ theme }) => ({
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
  minHeight: HEADER_HEIGHT,
  width: '100%',
  paddingHorizontal: theme.contentPage.marginHorizontal,
}))

const ButtonContainer = styled.View<{ positionInHeader: 'left' | 'right' }>(
  ({ positionInHeader = 'left', theme }) => {
    const isLeftComponent = positionInHeader === 'left'
    const marginHorizontal = theme.designSystem.size.spacing.s
    return {
      alignItems: isLeftComponent ? 'flex-start' : 'center',
      justifyContent: isLeftComponent ? 'flex-start' : 'flex-end',
      minWidth: BACK_BUTTON_MAX_SIZE,
      marginLeft: isLeftComponent ? 0 : marginHorizontal,
      marginRight: isLeftComponent ? marginHorizontal : 0,
    }
  }
)
