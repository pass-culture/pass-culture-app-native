import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

import { Typo, getSpacing } from 'ui/theme'

type Props = {
  message?: string
}

export function Loader({ message }: Props) {
  return (
    <Center testID="loadingScreen">
      <LoaderIndicator accessibilityLabel="Chargement en cours..." />
      {message ? <StyledBodyAccent>{message}</StyledBodyAccent> : null}
    </Center>
  )
}

const Center = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: getSpacing(50),
})

const LoaderIndicator = styled(ActivityIndicator).attrs(({ theme }) => ({
  size: 'large',
  color: theme.designSystem.color.icon.brandPrimary,
}))``

const StyledBodyAccent = styled(Typo.BodyAccent)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
