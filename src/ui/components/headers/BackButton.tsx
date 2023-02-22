import React from 'react'
import styled from 'styled-components/native'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { styledButton } from 'ui/components/buttons/styledButton'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

interface HeaderIconProps {
  onGoBack?: () => void
  color?: ColorsEnum
  height?: string
  maxWidth?: string
}

export const BackButton: React.FC<HeaderIconProps> = ({ onGoBack, color, ...props }) => {
  const { goBack } = useGoBack(...homeNavConfig)
  return (
    <StyledTouchable
      onPress={onGoBack || goBack}
      accessibilityLabel="Revenir en arrière"
      {...props}>
      <ArrowPrevious testID="icon-back" color={color} />
      <HiddenAccessibleText>Retour</HiddenAccessibleText>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)({
  flexGrow: 1,
  justifyContent: 'center',
  alignItems: 'center',
  height: getSpacing(10),
  maxWidth: getSpacing(10),
})

const ArrowPrevious = styled(DefaultArrowPrevious).attrs<{ color: ColorsEnum }>(
  ({ theme, color }) => ({
    color: color ?? theme.colors.white,
    size: theme.icons.sizes.small,
  })
)``
