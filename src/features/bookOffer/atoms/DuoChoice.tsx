import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

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
  const theme = useTheme()
  const textColor = getTextColor(theme, selected, disabled)

  return (
    <ChoiceBloc onPress={onPress} testID={testID} selected={selected} disabled={disabled}>
      <Container>
        <Icon color={textColor} size={28} />
        <Typo.ButtonText color={textColor}>{title}</Typo.ButtonText>

        <Caption testID={`${testID}-price`} color={textColor}>
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
