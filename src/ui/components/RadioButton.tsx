import React from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

interface RadioButtonProps {
  id: string
  title: string
  description?: string
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
        key={props.id}
        onPress={() => onSelect(props.id)}
        testID={`radio-button-${props.id}`}>
        <TitleContainer>
          <Title color={props.selectedValue === props.id ? ColorsEnum.PRIMARY : ColorsEnum.BLACK}>
            {props.title}
          </Title>
          {!!props.description && <Subtitle>{props.description}</Subtitle>}
        </TitleContainer>

        <IconContainer>
          {props.selectedValue === props.id && <Validate color={ColorsEnum.PRIMARY} />}
        </IconContainer>
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
  flex: 0.95,
})

const Title = styled(Typo.ButtonText)<{ color: ColorsEnum }>(({ color }) => ({
  color: color,
}))

const Subtitle = styled(Typo.Caption)({
  color: ColorsEnum.GREY_DARK,
})

const IconContainer = styled.View({
  width: 32,
})
