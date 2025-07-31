import React, { memo, useState } from 'react'
import { Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { useForHeightKeyboardEvents } from 'ui/components/keyboard/useKeyboardEvents'

type Props = {
  onSubmit: () => void
  isSubmitDisabled?: boolean
  buttonWording?: string
}

export const LocationModalFooter = memo(function LocationModalFooter({
  onSubmit,
  isSubmitDisabled,
  buttonWording = 'Valider la localisation',
}: Props) {
  const { modal } = useTheme()
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  useForHeightKeyboardEvents(setKeyboardHeight)

  const modalSpacing = Platform.OS === 'ios' ? modal.spacing.LG : modal.spacing.SM

  return (
    <Container paddingBottom={keyboardHeight ? keyboardHeight - modalSpacing : 0}>
      <ButtonPrimary wording={buttonWording} disabled={isSubmitDisabled} onPress={onSubmit} />
    </Container>
  )
})

const Container = styled.View<{ paddingBottom: number }>(({ paddingBottom, theme }) => ({
  ...(paddingBottom ? { paddingBottom } : {}),
  alignItems: 'center',
  paddingHorizontal: theme.designSystem.size.spacing.xl,
}))
