import React from 'react'
import styled from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Bell } from 'ui/svg/icons/Bell'
import { BellFilled } from 'ui/svg/icons/BellFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const SubscribeButton = ({ active, onPress }: { active: boolean; onPress: () => void }) => {
  const Icon = active ? StyledBellFilled : StyledBell
  return (
    <StyledTouchableOpacity
      accessibilityLabel={active ? 'Thème déjà suivi' : 'Suivre ce thème'}
      onPress={onPress}>
      <Icon />
      <Spacer.Row numberOfSpaces={2} />
      <Typo.Caption>{active ? 'Déjà suivi' : 'Suivre'}</Typo.Caption>
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
