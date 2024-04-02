import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useWhiteStatusBar } from 'libs/hooks/useWhiteStatusBar'
import { BackButton } from 'ui/components/headers/BackButton'
import { CloseButton } from 'ui/components/headers/CloseButton'
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
  shouldDisplayCloseButton?: boolean
  onClose?: () => void
}

const HEIGHT_CONTAINER = getSpacing(12)

export const PageHeaderSecondary: React.FC<Props> = ({
  title,
  titleID,
  onGoBack,
  testID,
  shouldDisplayBackButton = true,
  shouldDisplayCloseButton,
  onClose,
}) => {
  useWhiteStatusBar()

  const { top } = useCustomSafeInsets()

  return (
    <Header>
      <View style={{ height: HEIGHT_CONTAINER + top }} />
      <ColorContainer testID={testID}>
        <Spacer.TopScreen />
        <Container>
          <Row>
            <ButtonContainer positionInHeader="left" testID="back-button-container">
              {!!shouldDisplayBackButton && (
                <BackButton onGoBack={onGoBack} color={ColorsEnum.WHITE} />
              )}
            </ButtonContainer>
            <Title nativeID={titleID}>{title}</Title>
            <ButtonContainer positionInHeader="right" testID="close-button-container">
              {!!shouldDisplayCloseButton && (
                <StyledCloseButton onClose={onClose} color={ColorsEnum.WHITE} />
              )}
            </ButtonContainer>
          </Row>
        </Container>
      </ColorContainer>
    </Header>
  )
}

const ColorContainer = styled.View(({ theme }) => ({
  zIndex: theme.zIndex.header,
  position: 'absolute',
  top: 0,
  width: '100%',
  backgroundColor: theme.colors.primary,
}))

const Container = styled.View({
  alignItems: 'center',
  height: HEIGHT_CONTAINER,
  justifyContent: 'center',
})

const Title = styled.Text.attrs(() => ({
  numberOfLines: 1,
  ...getHeadingAttrs(1),
}))(({ theme }) => ({
  ...theme.typography.body,
  textAlign: 'center',
  color: theme.colors.white,
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

const Header = styled.View.attrs<{ children: React.ReactNode }>({
  accessibilityRole: AccessibilityRole.HEADER,
})({
  width: '100%',
})

const StyledCloseButton = styled(CloseButton)({
  width: getSpacing(10),
  height: getSpacing(10),
})
