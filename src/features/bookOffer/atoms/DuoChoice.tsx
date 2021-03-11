import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { IconInterface } from 'ui/svg/icons/types'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

import { ChoiceBloc } from './ChoiceBloc'

interface Props {
  title: string
  price: string
  selected: boolean
  icon: FunctionComponent<IconInterface>
  onPress: () => void
}

export const DuoChoice: React.FC<Props> = ({ title, price, selected, icon: Icon, onPress }) => {
  const textColor = selected ? ColorsEnum.WHITE : ColorsEnum.BLACK
  return (
    <ChoiceBloc onPress={onPress} selected={selected}>
      <Container>
        <Icon color={textColor} size={28} />
        <Typo.ButtonText color={textColor}>{title}</Typo.ButtonText>

        <Typo.Caption testID="price" color={textColor}>
          {price}
        </Typo.Caption>
      </Container>
    </ChoiceBloc>
  )
}

const Container = styled.View({
  paddingVertical: getSpacing(2),
  alignItems: 'center',
})
