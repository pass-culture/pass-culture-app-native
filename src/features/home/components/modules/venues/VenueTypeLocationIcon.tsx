import React from 'react'
import styled from 'styled-components/native'

import { LocationPointerWithBorder } from 'ui/svg/icons/LocationPointerWithBorder'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export const VenueTypeLocationIcon = ({
  VenueTypeIcon,
  iconColor,
  backgroundColor,
}: {
  VenueTypeIcon: React.FC<IconInterface>
  iconColor?: ColorsEnum
  backgroundColor?: ColorsEnum
}) => {
  const StyledVenueTypeIcon = styled(VenueTypeIcon).attrs(({ theme }) => ({
    color: iconColor ?? theme.colors.black,
    size: getSpacing(20),
  }))``

  const StyledLocationPointerWithBorder = styled(LocationPointerWithBorder).attrs(({ theme }) => ({
    color: iconColor ?? theme.colors.black,
    color2: backgroundColor ?? theme.colors.white,
    size: getSpacing(10),
  }))``

  return (
    <Container backgroundColor={backgroundColor}>
      <StyledVenueTypeIcon />
      <PointerContainer>
        <StyledLocationPointerWithBorder />
      </PointerContainer>
    </Container>
  )
}

const Container = styled.View<{ backgroundColor?: ColorsEnum }>(({ theme, backgroundColor }) => ({
  background: backgroundColor ?? theme.colors.white,
  position: 'relative',
  width: getSpacing(20),
}))

const PointerContainer = styled.View({
  position: 'absolute',
  bottom: 0,
  right: -getSpacing(1.5),
})
