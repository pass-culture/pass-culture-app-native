import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import LottieView from 'libs/lottie'
import LoadingAnimation from 'ui/animations/lottie_loading.json'
import { Background } from 'ui/svg/Background'
import { Typo } from 'ui/theme'
export const LoadingPage: FunctionComponent = () => {
  return (
    <Container>
      <Background />
      <StyledLottieView testID="Loading-Animation" source={LoadingAnimation} autoPlay loop />
      <LoadingText>{t`Chargement en cours...`}</LoadingText>
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'center',
  alignSelf: 'center',
  alignItems: 'center',
  width: '100%',
})

const StyledLottieView = styled(LottieView)({
  width: 150,
  height: 150,
})

const LoadingText = styled(Typo.Body)(({ theme }) => ({
  top: -16,
  textAlign: 'center',
  fontSize: 15,
  color: theme.colors.white,
}))
