import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { ColorsType } from 'theme/types'
import { styledButton } from 'ui/components/buttons/styledButton'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'

interface HeaderIconProps {
  onGoBack?: () => void
  color?: ColorsType
}

export const BackButton: React.FC<HeaderIconProps> = ({ onGoBack, color }) => {
  const { goBack } = useNavigation<UseNavigationType>()

  return (
    <StyledTouchable onPress={onGoBack || goBack} accessibilityLabel="Revenir en arrière">
      <ArrowPrevious testID="icon-back" color={color} />
      <HiddenAccessibleText>Retour</HiddenAccessibleText>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)(({ theme }) => {
  const BACK_BUTTON_MAX_SIZE = theme.designSystem.size.spacing.xxxl
  return {
    flexGrow: 1,
    maxWidth: BACK_BUTTON_MAX_SIZE,
    height: BACK_BUTTON_MAX_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

const ArrowPrevious = styled(DefaultArrowPrevious).attrs<{ color?: ColorsType }>(
  ({ theme, color }) => ({
    color: color ?? theme.designSystem.color.icon.default,
    size: theme.icons.sizes.small,
  })
)``
