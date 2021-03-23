import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo } from 'ui/theme'

import { ChoiceBloc, getTextColor } from './ChoiceBloc'

interface Props {
  title: string
  price: string
  selected: boolean
  icon: FunctionComponent<IconInterface>
  onPress: () => void
  hasEnoughCredit: boolean
}

export const DuoChoice: React.FC<Props> = ({
  title,
  price,
  selected,
  icon: Icon,
  onPress,
  hasEnoughCredit,
}) => {
  const disabled = !hasEnoughCredit
  const textColor = getTextColor(selected, disabled)

  return (
    <ChoiceBloc onPress={onPress} selected={selected} disabled={disabled}>
      <Container>
        <Icon color={textColor} size={28} />
        <Typo.ButtonText color={textColor}>{title}</Typo.ButtonText>

        <Caption testID="price" color={textColor}>
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

const Caption = styled(Typo.Caption)({ textAlign: 'center' })
