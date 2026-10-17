import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { DotsLoader } from 'ui/animations/DotsLoader'
import { Typo, getSpacing } from 'ui/theme'

type Props = {
  message?: string
}

export function Loader({ message }: Props) {
  const { designSystem } = useTheme()

  return (
    <Center testID="loadingScreen">
      <LoaderIndicator accessibilityLabel="Chargement en cours..." accessibilityRole="progressbar">
        <DotsLoader
          color={designSystem.color.background.brandPrimary}
          shadowColor={designSystem.color.background.inverted}
          size={LOADER_SIZE}
        />
      </LoaderIndicator>
      {message ? <StyledBodyAccent>{message}</StyledBodyAccent> : null}
    </Center>
  )
}

const LOADER_SIZE = getSpacing(30)

const Center = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: getSpacing(50),
})

const LoaderIndicator = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.decorative04,
  borderBottomRightRadius: 32,
  borderTopLeftRadius: 32,
  height: LOADER_SIZE,
  width: LOADER_SIZE,
}))

const StyledBodyAccent = styled(Typo.BodyAccent)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l - getSpacing(2),
}))
