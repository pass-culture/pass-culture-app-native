import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { Typo, Spacer } from 'ui/theme'

interface Props {
  onPress?: () => void
}

export const CloseButton = ({ onPress }: Props) => {
  return (
    <StyledTouchable
      onPress={onPress}
      {...accessibilityAndTestId(t`Fermer la modale et refuser les cookies`)}>
      <InvalidateGreyDark />
      <Spacer.Row numberOfSpaces={1} />
      <StyledCaption>{t`Tout fermer`}</StyledCaption>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const InvalidateGreyDark = styled(Invalidate).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
}))``
