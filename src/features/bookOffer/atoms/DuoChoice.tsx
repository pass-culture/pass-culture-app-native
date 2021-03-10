import { t } from '@lingui/macro'
import React from 'react'

import { _ } from 'libs/i18n'
import { ColorsEnum, Typo } from 'ui/theme'

import { ChoiceBloc } from './ChoiceBloc'

interface Props {
  quantity: 1 | 2
  price: string
  selected: boolean
  onPress: () => void
  testID?: string
}

export const DuoChoice: React.FC<Props> = ({ quantity, price, selected, onPress, testID }) => {
  const textColor = selected ? ColorsEnum.WHITE : ColorsEnum.BLACK
  const title = quantity === 1 ? _(t`Solo`) : _(t`Duo`)
  return (
    <ChoiceBloc onPress={onPress} selected={selected}>
      <React.Fragment>
        {/* add icon in next commit */}
        <Typo.ButtonText color={textColor}>{title}</Typo.ButtonText>

        <Typo.Caption testID="price" color={textColor}>
          {price}
        </Typo.Caption>
      </React.Fragment>
    </ChoiceBloc>
  )
}
