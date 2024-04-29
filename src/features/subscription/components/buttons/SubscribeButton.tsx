import React from 'react'
import styled from 'styled-components/native'

import { ToggleButton } from 'ui/components/buttons/ToggleButton'
import { Bell } from 'ui/svg/icons/Bell'
import { BellFilled } from 'ui/svg/icons/BellFilled'

type Activable<T> = {
  active: T
  inactive: T
}

type Props = {
  active: boolean
  onPress: () => void
  label: Activable<string>
}

export const SubscribeButton = ({ active, onPress, label }: Props) => {
  return (
    <ToggleButton
      active={active}
      onPress={onPress}
      label={label}
      accessibilityLabel={{ active: 'Thème déjà suivi', inactive: 'Suivre le thème' }}
      Icon={{ active: StyledBellFilled, inactive: StyledBell }}
    />
  )
}

const StyledBell = styled(Bell).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const StyledBellFilled = styled(BellFilled).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))``
