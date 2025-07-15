import React, { FunctionComponent, memo } from 'react'
import styled from 'styled-components/native'

import LoadingAnimation from 'ui/animations/lottie_loading.json'
import { Page } from 'ui/pages/Page'
import { Typo } from 'ui/theme'

import { ThemedStyledLottieView } from '../animations/ThemedStyledLottieView'

const UnmemoizedLoadingPage: FunctionComponent = () => {
  return (
    <Container>
      <ThemedStyledLottieView width={150} height={150} source={LoadingAnimation} />
      <LoadingText>Chargement en cours...</LoadingText>
    </Container>
  )
}

export const LoadingPage = memo(UnmemoizedLoadingPage)

const Container = styled(Page)({
  flexDirection: 'column',
  flexGrow: 1,
  justifyContent: 'center',
  alignSelf: 'center',
  alignItems: 'center',
  width: '100%',
})

const LoadingText = styled(Typo.Body)(({ theme }) => ({
  top: -16,
  textAlign: 'center',
  color: theme.designSystem.color.background.brandPrimary,
}))
