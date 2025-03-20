import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { Spacer, Typo, getSpacing } from 'ui/theme'

export const VideoErrorView: React.FC<{
  style: StyleProp<ViewStyle>
}> = ({ style }) => {
  const errorTitle = 'Oups\u00a0!'
  const errorMessage = 'Une erreur s’est produite pendant le chargement de la vidéo.'

  return (
    <VideoPlayerErrorViewContainer style={style}>
      <HeaderBackground />
      <ErrorMessageContainer>
        <StyledTitle>{errorTitle}</StyledTitle>
        <Spacer.Column numberOfSpaces={4} />
        <StyledBody>{errorMessage}</StyledBody>
      </ErrorMessageContainer>
    </VideoPlayerErrorViewContainer>
  )
}

const VideoPlayerErrorViewContainer = styled(View)({
  borderTopLeftRadius: getSpacing(4),
  borderTopRightRadius: getSpacing(4),
  overflow: 'hidden',
})

const ErrorMessageContainer = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: getSpacing(6),
})

const StyledTitle = styled(Typo.Title2)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
