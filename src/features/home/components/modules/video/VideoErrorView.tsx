import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { HeaderBackground } from 'ui/svg/HeaderBackground'
import { Typo, getSpacing } from 'ui/theme'

export const VideoErrorView: React.FC<{
  style: StyleProp<ViewStyle>
}> = ({ style }) => {
  const errorTitle = 'Oups\u00a0!'
  const errorMessage = 'Une erreur s’est produite pendant le chargement de la vidéo.'

  return (
    <VideoPlayerErrorViewContainer style={style}>
      <HeaderBackground />
      <ErrorMessageContainer gap={4}>
        <StyledTitle>{errorTitle}</StyledTitle>
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

const ErrorMessageContainer = styled(ViewGap)(({ theme }) => ({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.designSystem.size.spacing.xl,
}))

const StyledTitle = styled(Typo.Title2)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
  textAlign: 'center',
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.lockedInverted,
  textAlign: 'center',
}))
