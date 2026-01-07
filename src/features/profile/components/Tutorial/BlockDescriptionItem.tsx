import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

type Props = {
  icon: React.ReactElement
  text: string
}

export const BlockDescriptionItem = ({ icon, text }: Props) => {
  return (
    <ItemContainer>
      <IconContainer>{icon}</IconContainer>
      <StyledCaption>{text}</StyledCaption>
    </ItemContainer>
  )
}

const ItemContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  flexShrink: 1,
})

const StyledCaption = styled(Typo.BodyAccentXs)({
  flexShrink: 1,
})

const IconContainer = styled.View(({ theme }) => ({
  marginRight: theme.designSystem.size.spacing.s,
  width: theme.icons.sizes.extraSmall,
  height: theme.icons.sizes.extraSmall,
}))
