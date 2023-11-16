import React from 'react'
import { ActivityIndicator } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { Spacer, Typo } from 'ui/theme'

type BookingOfferLoaderProps = {
  message?: string
}

export function BookingOfferLoader({ message }: Readonly<BookingOfferLoaderProps>) {
  const theme = useTheme()

  return (
    <Center testID="loadingScreen">
      <Spacer.Column numberOfSpaces={50} />
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        accessibilityLabel="Chargement en cours..."
      />
      <Spacer.Column numberOfSpaces={4} />
      <Typo.ButtonText>{message}</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={50} />
    </Center>
  )
}

const Container = styled.View({ width: '100%' })

const Center = styled(Container)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})
