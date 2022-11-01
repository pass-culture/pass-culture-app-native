import React from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  onPress: () => void
}

export const GeolocationButton = ({ onPress }: Props) => {
  return (
    <StyledTouchable onPress={onPress}>
      <SubContainer>
        <IconWrapper>
          <LocationIcon />
        </IconWrapper>
        <Spacer.Row numberOfSpaces={2} />
        <TextWrapper>
          <TitleText>Géolocalise toi</TitleText>
          <Spacer.Column numberOfSpaces={1} />
          <DescriptionText numberOfLines={2}>
            Pour trouver des offres autour de toi.
          </DescriptionText>
        </TextWrapper>
      </SubContainer>
      <Spacer.Row numberOfSpaces={2} />
      <IconWrapper>
        <ArrowNextIcon />
      </IconWrapper>
    </StyledTouchable>
  )
}

const StyledTouchable = styledButton(Touchable)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: getSpacing(4),
  border: `1px solid ${theme.colors.greySemiDark}`,
  borderRadius: theme.borderRadius.radius,
}))

const SubContainer = styled.View({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
})

const IconWrapper = styled.View({
  flexShrink: 0,
})

const TextWrapper = styled.View({
  flexShrink: 1,
})

const TitleText = styled(Typo.ButtonText)({
  textAlign: 'left',
})

const DescriptionText = styled(Typo.Caption)({
  textAlign: 'left',
})

const LocationIcon = styled(Everywhere).attrs(({ theme }) => ({
  size: theme.icons.sizes.standard,
}))``

const ArrowNextIcon = styled(ArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
