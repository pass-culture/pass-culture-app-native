import React from 'react'
import { ActivityIndicator, Text } from 'react-native'
import { useTheme } from 'styled-components'
import styled from 'styled-components/native'

import { Spacer } from 'ui/theme'

type ModalLoaderProps = {
  message?: string
}

export function ModalLoader({ message }: ModalLoaderProps) {
  const theme = useTheme()
  const messageStyle = {
    color: theme.colors.primary,
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 25,
  }

  return (
    <Center testID="loadingScreen">
      <Spacer.Column numberOfSpaces={15} />
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        accessibilityLabel="Veuillez patienter! Nous..."
      />
      <Spacer.Column numberOfSpaces={10} />

      <Text style={messageStyle}>{message}</Text>
      <Spacer.Column numberOfSpaces={10} />
    </Center>
  )
}

const Container = styled.View({ width: '100%' })

const Center = styled(Container)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})
