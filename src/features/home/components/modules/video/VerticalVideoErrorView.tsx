import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { BackgroundWithDefaultStatusBar } from 'ui/svg/Background'
import { BicolorBrokenConnection } from 'ui/svg/BicolorBrokenConnection'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const ERROR_TITLE = 'Oups\u00a0!'
const ERROR_MESSAGE = 'Une erreur s’est produite pendant le chargement de la vidéo'

export const VerticalVideoErrorView: React.FC<{
  style?: StyleProp<ViewStyle>
}> = ({ style }) => {
  return (
    <Content style={style}>
      <Spacer.TopScreen />
      <BackgroundWithDefaultStatusBar />
      <BrokenConnectionContainer>
        <BicolorBrokenConnection
          color={theme.colors.white}
          color2={theme.colors.white}
          size={theme.illustrations.sizes.fullPage}
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
  color: theme.colors.white,
  textAlign: 'center',
}))

const StyledErrorMessage = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
