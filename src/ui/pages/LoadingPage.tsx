import React, { FunctionComponent, memo } from 'react'
import styled from 'styled-components/native'

import LottieView from 'libs/lottie'
import { theme } from 'theme'
import LoadingAnimation from 'ui/animations/lottie_loading.json'
import { Page } from 'ui/pages/Page'
import { Typo } from 'ui/theme'

const UnmemoizedLoadingPage: FunctionComponent = () => {
  return (
    <Container>
      <StyledLottieView
        source={LoadingAnimation}
        autoPlay
        loop
        colorFilters={[
          {
            keypath: '**.Stroke 1',
            color: theme.uniqueColors.brand,
          },
          {
            keypath: '**.Fill 1',
            color: theme.uniqueColors.brand,
          },
        ]}
      />
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

const StyledLottieView = styled(LottieView)({
  width: 150,
  height: 150,
})

const LoadingText = styled(Typo.Body)(({ theme }) => ({
  top: -16,
  textAlign: 'center',
  color: theme.uniqueColors.brand,
}))
