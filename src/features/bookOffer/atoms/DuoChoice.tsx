import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { DuoPerson } from 'ui/svg/icons/DuoPerson'
import { Profile } from 'ui/svg/icons/Profile'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

import { ChoiceBloc } from './ChoiceBloc'

interface Props {
  quantity: 1 | 2
  price: string
  selected: boolean
  onPress: () => void
}

export const DuoChoice: React.FC<Props> = ({ quantity, price, selected, onPress }) => {
  const textColor = selected ? ColorsEnum.WHITE : ColorsEnum.BLACK
  const title = quantity === 1 ? _(t`Solo`) : _(t`Duo`)
  return (
    <ChoiceBloc onPress={onPress} selected={selected}>
      <Container>
        {quantity === 1 ? (
          <Profile color={textColor} size={28} />
        ) : (
          <DuoPerson color={textColor} size={28} />
        )}
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
