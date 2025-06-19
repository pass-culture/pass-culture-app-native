import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

import { Spacer, Typo } from 'ui/theme'

type Props = {
  message?: string
}

export function Loader({ message }: Props) {
  return (
    <Center testID="loadingScreen">
      <Spacer.Column numberOfSpaces={50} />
      <LoaderIndicator accessibilityLabel="Chargement en cours..." />
      {message ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <Typo.BodyAccent>{message}</Typo.BodyAccent>
        </React.Fragment>
      ) : null}
      <Spacer.Column numberOfSpaces={50} />
    </Center>
  )
}

const Center = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
})

const LoaderIndicator = styled(ActivityIndicator).attrs(({ theme }) => ({
  size: 'large',
  color: theme.designSystem.color.icon.brandPrimary,
}))``
