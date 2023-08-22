import colorAlpha from 'color-alpha'
import React, { FunctionComponent, ReactNode } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { BackButton } from 'ui/components/headers/BackButton'
import { getSpacing, Spacer } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'
import { useCustomSafeInsets } from 'ui/theme/useCustomSafeInsets'

interface Props {
  title: string
  titleID?: string
  onGoBack?: () => void
  testID?: string
  shouldDisplayBackButton?: boolean
  RightButton?: ReactNode
  children?: ReactNode
}

const HEADER_HEIGHT = getSpacing(12)

export const useGetHeaderHeight = () => {
  const { top } = useCustomSafeInsets()

  return HEADER_HEIGHT + top + 1
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
}) => {
  return (
    <Header testID={testID} accessibilityRole={AccessibilityRole.HEADER}>
      <Spacer.TopScreen />
      <Container>
        <Row>
          <ButtonContainer positionInHeader="left" testID="back-button-container">
            {!!shouldDisplayBackButton && (
              <BackButton onGoBack={onGoBack} color={ColorsEnum.BLACK} />
            )}
          </ButtonContainer>
          <Title nativeID={titleID}>{title}</Title>
          <ButtonContainer positionInHeader="right" testID="close-button-container">
            {RightButton}
          </ButtonContainer>
        </Row>
      </Container>
      {children}
    </Header>
  )
}

const Header = styled.View(({ theme }) => ({
  zIndex: theme.zIndex.header,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  // There is an issue with the blur on Android: we chose to render white background for the header
  backgroundColor:
    Platform.OS === 'android' ? theme.colors.white : colorAlpha(theme.colors.white, 0),
  borderBottomColor: theme.colors.greyLight,
  borderBottomWidth: 1,
}))

const Container = styled.View({
  alignItems: 'center',
  height: HEADER_HEIGHT,
  justifyContent: 'center',
})

const Title = styled.Text.attrs(() => ({
  numberOfLines: 1,
  ...getHeadingAttrs(1),
}))(({ theme }) => ({
  ...theme.typography.body,
  textAlign: 'center',
}))

const Row = styled.View({
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
})

const ButtonContainer = styled.View<{ positionInHeader: 'left' | 'right' }>(
  ({ positionInHeader = 'left' }) => ({
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: positionInHeader === 'left' ? 'flex-start' : 'flex-end',
    paddingLeft: getSpacing(3),
    paddingRight: getSpacing(3),
  })
)
