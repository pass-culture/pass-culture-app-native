import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowPrevious as DefaultArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

interface HeaderIconProps {
  onGoBack?: () => void
  color?: ColorsEnum
}

export const BackButton: React.FC<HeaderIconProps> = ({ onGoBack, color }) => {
  const { goBack } = useGoBack(...homeNavConfig)
  return (
    <Touchable
      onPress={onGoBack || goBack}
      {...accessibilityAndTestId(t`Revenir en arrière`, 'backButton')}>
      <ArrowPrevious testID="icon-back" color={color} />
      <HiddenAccessibleText>{t`Retour`}</HiddenAccessibleText>
    </Touchable>
  )
}

const ArrowPrevious = styled(DefaultArrowPrevious).attrs<{ color: ColorsEnum }>(
  ({ theme, color }) => ({
    color: color ?? theme.colors.white,
    size: theme.icons.sizes.small,
  })
)``
