import React from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

interface RadioButtonItem {
  id: string
  title: string
  description?: string
}

interface RadioButtonProps {
  choices: RadioButtonItem
  onSelect: (value: string) => void
  selectedValue: string
}

export function RadioButton(props: RadioButtonProps) {
  function onSelect(value: string) {
    props.onSelect(value)
  }

  return (
    <React.Fragment>
      <PressableContainer
        key={props.choices.id}
        onPress={() => onSelect(props.choices.id)}
        // testID={`radio-button-${index}`}
      >
        <TitleContainer>
          <Title
            color={
              props.selectedValue === props.choices.id ? ColorsEnum.PRIMARY : ColorsEnum.BLACK
            }>
            {props.choices.title}
          </Title>
          {!!props.choices.description && <Subtitle>{props.choices.description}</Subtitle>}
        </TitleContainer>

        {props.selectedValue === props.choices.id && <Validate color={ColorsEnum.PRIMARY} />}
      </PressableContainer>
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const PressableContainer = styled.TouchableOpacity({
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const TitleContainer = styled.View({
  flexDirection: 'column',
  flex: 0.9,
})

const Title = styled(Typo.ButtonText)<{ color: ColorsEnum }>(({ color }) => ({
  color: color,
}))

const Subtitle = styled(Typo.Caption)({
  color: ColorsEnum.GREY_DARK,
})
