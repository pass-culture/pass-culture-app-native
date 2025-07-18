import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import { ImageSourcePropType, Modal } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  visible: boolean
  title: string
  imageSource: ImageSourcePropType
  numberOfLinesTitle?: number
  onBackdropPress: () => void
  children?: React.ReactNode
}

export const MarketingModal: FunctionComponent<Props> = ({
  visible,
  title,
  imageSource,
  numberOfLinesTitle,
  children,
  onBackdropPress,
}) => {
  const titleID = uuidv4()
  return (
    <Modal
      animationType="fade"
      statusBarTranslucent
      transparent
      visible={visible}
      onRequestClose={onBackdropPress}
      accessibilityLabelledBy={titleID}>
      <ClickAwayArea onPress={onBackdropPress} testID="clickaway-area" />
      <FlexSpacer />
      <Container>
        <Flex>
          <FlexContainer>
            <ImageBackground source={imageSource} />
          </FlexContainer>
          <Gradient />
          <FlexContainer>
            <Content gap={6}>
              <Title nativeID={titleID} numberOfLines={numberOfLinesTitle}>
                {title}
              </Title>
              {children}
            </Content>
          </FlexContainer>
        </Flex>
      </Container>
      <FlexSpacer />
    </Modal>
  )
}

const GRADIENT_SIZE = getSpacing(18)
const Gradient = styled(LinearGradient).attrs(({ theme }) => ({
  colors: [
    colorAlpha(theme.designSystem.color.background.default, 0),
    theme.designSystem.color.background.default,
  ],
  locations: [0, 0.85],
}))({
  height: GRADIENT_SIZE,
  marginTop: -GRADIENT_SIZE,
})

const Title = styled(Typo.Title3).attrs(() => getHeadingAttrs(1))({
  textAlign: 'center',
})

const Flex = styled.View({
  flexGrow: 1,
  width: '100%',
})

const FlexContainer = styled.View({
  flexGrow: 0.5,
  alignItems: 'center',
})

const ImageBackground = styled.ImageBackground(({ theme }) => {
  const imageHeight = theme.isDesktopViewport || theme.isSmallScreen ? 190 : 252
  return {
    width: '100%',
    height: imageHeight,
  }
})

const ClickAwayArea = styled(TouchableOpacity).attrs({ activeOpacity: 1 })(({ theme }) => ({
  flexGrow: 1,
  flexDirection: 'column',
  justifyContent: 'flex-end',
  position: 'absolute',
  height: '100%',
  width: '100%',
  backgroundColor: theme.designSystem.color.background.overlay,
}))

const MIN_MODAL_HEIGHT = 360
const MAX_MODAL_HEIGHT = 650
const Container = styled.View(({ theme }) => {
  const modalWidth =
    theme.isMobileViewport && !theme.isTabletViewport
      ? theme.appContentWidth - getSpacing(8)
      : theme.breakpoints.sm - getSpacing(3)
  return {
    backgroundColor: theme.designSystem.color.background.default,
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: getSpacing(4),
    overflow: 'hidden',
    maxHeight: MAX_MODAL_HEIGHT,
    minHeight: MIN_MODAL_HEIGHT,
    width: modalWidth,
  }
})

const Content = styled(ViewGap)(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  padding: getSpacing(6),
  paddingBottom: getSpacing(8),
  maxWidth: theme.contentPage.maxWidth,
}))

const FlexSpacer = styled(Spacer.Flex)(({ theme }) => ({
  zIndex: theme.zIndex.background,
}))
