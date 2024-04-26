import React from 'react'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Bell } from 'ui/svg/icons/Bell'
import { BellFilled } from 'ui/svg/icons/BellFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  active: boolean
  onPress: () => void
  hasLongTitle?: boolean
}

export const SubscribeButton = ({ active, onPress, hasLongTitle: fullTitle = false }: Props) => {
  const Icon = active ? StyledBellFilled : StyledBell
  const inactiveText = fullTitle ? 'Suivre le thème' : 'Suivre'
  const activeText = fullTitle ? 'Thème suivi' : 'Déjà suivi'
  return (
    <StyledTouchableOpacity
      accessibilityLabel={active ? 'Thème déjà suivi' : 'Suivre le thème'}
      onPress={onPress}>
      <Icon />
      <Spacer.Row numberOfSpaces={2} />
      <Typo.Caption>{active ? activeText : inactiveText}</Typo.Caption>
    </StyledTouchableOpacity>
  )
}

const StyledTouchableOpacity = styled(TouchableOpacity)(({ theme }) => ({
  borderColor: theme.colors.greySemiDark,
  borderWidth: getSpacing(0.25),
  borderRadius: getSpacing(6),
  paddingHorizontal: getSpacing(3),
  paddingVertical: getSpacing(1),
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  backgroundColor: theme.colors.white,
}))

const StyledBell = styled(Bell).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const StyledBellFilled = styled(BellFilled).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))``
