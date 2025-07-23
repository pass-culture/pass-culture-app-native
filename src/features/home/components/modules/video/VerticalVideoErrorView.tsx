import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { BackgroundWithDefaultStatusBar } from 'ui/svg/Background'
import { BrokenConnection } from 'ui/svg/BrokenConnection'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const ERROR_TITLE = 'Oups\u00a0!'
const ERROR_MESSAGE = 'Une erreur s’est produite pendant le chargement de la vidéo'

export const VerticalVideoErrorView: React.FC<{
  style?: StyleProp<ViewStyle>
}> = ({ style }) => {
  const { designSystem, illustrations } = useTheme()
  return (
    <Content style={style}>
      <Spacer.TopScreen />
      <BackgroundWithDefaultStatusBar />
      <BrokenConnectionContainer>
        <BrokenConnection
          color={designSystem.color.icon.lockedInverted}
          size={illustrations.sizes.fullPage}
        />
      </BrokenConnectionContainer>
      <ErrorMessageContainer gap={4}>
        <StyledErrorTitle>{ERROR_TITLE}</StyledErrorTitle>
        <StyledErrorMessage>{ERROR_MESSAGE}</StyledErrorMessage>
      </ErrorMessageContainer>
    </Content>
  )
}

const Content = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  alignItems: 'center',
})

const BrokenConnectionContainer = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
})

const ErrorMessageContainer = styled(ViewGap)({
  flex: 1,
  justifyContent: 'flex-start',
  paddingTop: getSpacing(6),
  paddingHorizontal: getSpacing(6),
})

const StyledErrorTitle = styled(Typo.Title2)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
  textAlign: 'center',
}))

const StyledErrorMessage = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
  textAlign: 'center',
}))
