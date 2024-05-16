import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { getSpacing, Typo } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

export type CategoryButtonV2Props = {
  label: string
  textColor: string
  fillColor: string
  borderColor: string
  onPress: () => void
  children?: never
}

export const CategoryButtonV2: FunctionComponent<CategoryButtonV2Props> = ({
  label,
  textColor,
  fillColor,
  borderColor,
  onPress,
}) => {
  const focusProps = useHandleFocus()
  const theme = useTheme()
  return (
    <TouchableContainer
      {...focusProps}
      onPress={onPress}
      accessibilityLabel={`Catégorie ${label}`}
      hoverUnderlineColor={theme.colors.white}
      baseColor={fillColor}
      borderColor={borderColor}>
      <LabelContainer>
        <Label baseColor={textColor}>{label.toUpperCase()}</Label>
      </LabelContainer>
    </TouchableContainer>
  )
}

const TouchableContainer = styledButton(Touchable)<{
  isFocus?: boolean
  baseColor?: string
  borderColor?: string
}>(({ theme, isFocus, baseColor, borderColor }) => ({
  height: getSpacing(24.25),
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
  backgroundColor: baseColor,
  borderColor: borderColor,
  borderWidth: '1.6px',
  flexDirection: 'column',
  display: 'flex',
  justifyContent: 'flex-end',
}))

const LabelContainer = styled.View(({ theme }) => ({
  padding: theme.isMobileViewport ? getSpacing(2) : getSpacing(1),
  width: '100%',
}))

const Label = styled(Typo.ButtonText)<{ baseColor?: string }>(({ baseColor }) => ({
  textAlign: 'left',
  color: baseColor,
}))
