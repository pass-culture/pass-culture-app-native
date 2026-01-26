import React from 'react'
import styled from 'styled-components/native'

import { ColorsType } from 'theme/types'
import { LocationPointerWithBorder } from 'ui/svg/icons/LocationPointerWithBorder'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

export const ActivityLocationIcon = ({
  ActivityIcon,
  iconColor,
  backgroundColor,
}: {
  ActivityIcon: React.FC<AccessibleIcon>
  iconColor?: ColorsType
  backgroundColor?: ColorsType
}) => {
  const StyledActivityIcon = styled(ActivityIcon).attrs({
    color: iconColor,
    size: getSpacing(20),
  })``

  const StyledLocationPointerWithBorder = styled(LocationPointerWithBorder).attrs(({ theme }) => ({
    color: iconColor ?? theme.designSystem.color.icon.default,
    color2: backgroundColor ?? theme.designSystem.color.icon.inverted,
    size: theme.designSystem.size.spacing.xxxl,
  }))``

  return (
    <Container backgroundColor={backgroundColor}>
      <StyledActivityIcon />
      <PointerContainer>
        <StyledLocationPointerWithBorder />
      </PointerContainer>
    </Container>
  )
}

const Container = styled.View<{ backgroundColor?: ColorsType }>(({ theme, backgroundColor }) => ({
  background: backgroundColor ?? theme.designSystem.color.background.default,
  position: 'relative',
  width: getSpacing(20),
}))

const PointerContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: -theme.designSystem.size.spacing.s,
}))
