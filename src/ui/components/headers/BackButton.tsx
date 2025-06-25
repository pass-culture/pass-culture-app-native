import React from 'react'
import styled from 'styled-components/native'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { ColorsTypeLegacy } from 'theme/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { getSpacing } from 'ui/theme'

interface HeaderIconProps {
  onGoBack?: () => void
  color?: ColorsTypeLegacy
}

export const BackButton: React.FC<HeaderIconProps> = ({ onGoBack, color }) => {
  const { goBack } = useGoBack(...homeNavConfig)
  return (
    <StyledTouchable onPress={onGoBack || goBack} accessibilityLabel="Revenir en arrière">
      <ArrowPrevious testID="icon-back" color={color} />
      <HiddenAccessibleText>Retour</HiddenAccessibleText>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)({
  flexGrow: 1,
  maxWidth: getSpacing(10),
  height: getSpacing(10),
  justifyContent: 'center',
  alignItems: 'center',
})

const ArrowPrevious = styled(DefaultArrowPrevious).attrs<{ color: ColorsTypeLegacy }>(
  ({ theme, color }) => ({
    color: color ?? theme.designSystem.color.icon.default,
    size: theme.icons.sizes.small,
  })
)``
