import React from 'react'
import { useState } from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

interface RadioButtonItem {
  key: string
  title: string
  subtitle: string
}

interface RadioButtonProps {
  choices: RadioButtonItem[]
  onSelect: (value: string) => void
}

export function RadioButton(props: RadioButtonProps) {
  const [selectedValue, setSelectedValue] = useState('')

  function onSelect(value: string) {
    setSelectedValue(value)
    props.onSelect(value)
  }

  return (
    <React.Fragment>
      {props.choices.map((choice, index) => {
        return (
          <React.Fragment key={index}>
            <PressableContainer key={choice.key} onPress={() => onSelect(choice.key)}>
              <TitleContainer>
                <Title color={selectedValue === choice.key ? ColorsEnum.PRIMARY : ColorsEnum.BLACK}>
                  {choice.title}
                </Title>
                <Subtitle>{choice.subtitle}</Subtitle>
              </TitleContainer>
              {selectedValue === choice.key && <Validate color={ColorsEnum.PRIMARY} />}
            </PressableContainer>
            <Spacer.Column numberOfSpaces={6} />
          </React.Fragment>
        )
      })}
    </React.Fragment>
  )
}

const PressableContainer = styled.TouchableOpacity({
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
})

const TitleContainer = styled.View({
  flexDirection: 'column',
  flex: 1,
})

const Title = styled(Typo.ButtonText)<{ color: ColorsEnum }>(({ color }) => ({
  color: color,
}))

const Subtitle = styled(Typo.Caption)({
  color: ColorsEnum.GREY_DARK,
})
