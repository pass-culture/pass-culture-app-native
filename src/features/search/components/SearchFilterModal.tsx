import React, { FunctionComponent } from 'react'
import { useWindowDimensions } from 'react-native'
import { ReactNativeModal } from 'react-native-modal'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { appModalContainerStyle } from 'ui/components/modals/appModalContainerStyle'
import { ModalHeader, ModalHeaderProps } from 'ui/components/modals/ModalHeader'
import { ModalIconProps } from 'ui/components/modals/types'
import { getSpacing, Spacer } from 'ui/theme'

export type SearchFilterModalProps = {
  visible: boolean
  modalContentChildren: JSX.Element
  fixedBottomChildren: JSX.Element
  testID?: string
} & ModalHeaderProps

// Without this, the margin is recomputed with arbitraty values
const modalStyles = { margin: 'auto' }

export const SearchFilterModal: FunctionComponent<SearchFilterModalProps> = ({
  visible,
  modalContentChildren,
  fixedBottomChildren,
  testID,
  title,
  leftIconAccessibilityLabel,
  leftIcon,
  onLeftIconPress,
  rightIconAccessibilityLabel,
  rightIcon,
  onRightIconPress,
}) => {
  const { isDesktopViewport } = useTheme()
  const { height: windowHeight, width: windowWidth } = useWindowDimensions()
  const titleId = uuidv4()

  const iconProps = {
    rightIconAccessibilityLabel,
    rightIcon,
    onRightIconPress,
    leftIconAccessibilityLabel,
    leftIcon,
    onLeftIconPress,
  } as ModalIconProps

  return (
    <StyledModal
      style={modalStyles}
      supportedOrientations={['portrait', 'landscape']}
      statusBarTranslucent
      hasBackdrop
      isVisible={visible}
      testID={testID}
      deviceHeight={windowHeight}
      deviceWidth={windowWidth}
      aria-labelledby={titleId}
      accessibilityRole={AccessibilityRole.DIALOG}
      aria-modal={true}>
      <ModalContainer windowHeight={windowHeight}>
        {isDesktopViewport ? (
          <ModalHeader title={title} titleID={titleId} padding={getSpacing(4)} {...iconProps} />
        ) : (
          <PageHeader
            titleID={titleId}
            title={title}
            background="primary"
            withGoBackButton
            onGoBack={onRightIconPress}
            testID="pageHeader"
          />
        )}
        <StyledScrollView>{modalContentChildren}</StyledScrollView>
        <FixedBottomChildrenView>{fixedBottomChildren}</FixedBottomChildrenView>
        <Spacer.BottomScreen />
      </ModalContainer>
    </StyledModal>
  )
}

// @ts-ignore Argument of type 'typeof ReactNativeModal' is not assignable to parameter of type 'Any<StyledComponent>'
const StyledModal = styled(ReactNativeModal)<{ height: number }>(({ theme }) => {
  const { isDesktopViewport } = theme
  return {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    top: isDesktopViewport ? 0 : 'auto',
    alignItems: 'center',
  }
})

const ModalContainer = styled.View<{ windowHeight: number }>(({ windowHeight, theme }) => {
  const desktopMaxHeight = windowHeight * 0.75
  return appModalContainerStyle({
    theme,
    desktopMaxHeight,
    maxHeight: windowHeight,
    noPadding: true,
  })
})

const StyledScrollView = styled.ScrollView({
  width: '100%',
  paddingHorizontal: getSpacing(6),
})

const FixedBottomChildrenView = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.white,
  width: '100%',
}))
