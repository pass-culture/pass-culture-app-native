import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { ChoiceBloc, getTextColor } from 'features/bookOffer/components/ChoiceBloc'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  title: string
  price: string
  selected: boolean
  icon: FunctionComponent<IconInterface>
  onPress: () => void
  hasEnoughCredit: boolean
  testID: string
}

export const DuoChoice: React.FC<Props> = ({
  title,
  price,
  selected,
  icon: Icon,
  onPress,
  hasEnoughCredit,
  testID,
}) => {
  const disabled = !hasEnoughCredit

  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    size: theme.icons.sizes.small,
    color: getTextColor(theme, selected, disabled),
    color2: getTextColor(theme, selected, disabled),
  }))``

  const accessibilityLabel = `${title} ${price}`

  return (
    <ChoiceBloc
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      selected={selected}
      disabled={disabled}>
      <Container>
        <StyledIcon />
        <ButtonText selected={selected} disabled={disabled}>
          {title}
        </ButtonText>

        <Caption testID={`${testID}-price`} selected={selected} disabled={disabled}>
          {price}
        </Caption>
      </Container>
    </ChoiceBloc>
  )
}

const Container = styled.View({
  minHeight: getSpacing(20),
  justifyContent: 'center',
  alignItems: 'center',
})

interface TypoProps {
  selected: boolean
  disabled: boolean
}

const ButtonText = styled(Typo.ButtonText)<TypoProps>(({ selected, disabled, theme }) => ({
  color: getTextColor(theme, selected, disabled),
}))

const Caption = styled(Typo.Caption)<TypoProps>(({ selected, disabled, theme }) => ({
  color: getTextColor(theme, selected, disabled),
  textAlign: 'center',
}))
