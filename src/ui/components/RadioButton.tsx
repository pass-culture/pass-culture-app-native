import React from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
interface RadioButtonProps {
  id: string
  title: string
  description?: string
  onSelect: (value: string) => void
  selectedValue: string
}

export function RadioButton(props: RadioButtonProps) {
  return (
    <React.Fragment>
      <PressableContainer
        key={props.id}
        onPress={() => props.onSelect(props.id)}
        testID={`radio-button-${props.id}`}>
        <Spacer.Flex flex={0.9}>
          <Title color={props.selectedValue === props.id ? ColorsEnum.PRIMARY : ColorsEnum.BLACK}>
            {props.title}
          </Title>
          {!!props.description && <Subtitle>{props.description}</Subtitle>}
        </Spacer.Flex>

        <Spacer.Flex flex={0.1}>
          {props.selectedValue === props.id && (
            <Validate color={ColorsEnum.PRIMARY} size={getSpacing(6)} />
          )}
        </Spacer.Flex>
      </PressableContainer>
    </React.Fragment>
  )
}

const PressableContainer = styled.TouchableOpacity({
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const Title = styled(Typo.ButtonText)<{ color: ColorsEnum }>(({ color }) => ({
  color: color,
}))

const Subtitle = styled(Typo.Caption)({
  color: ColorsEnum.GREY_DARK,
})
