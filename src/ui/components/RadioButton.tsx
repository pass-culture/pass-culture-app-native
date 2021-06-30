import React from 'react'
import { useState } from 'react'
import styled from 'styled-components/native'

import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

interface RadioButtonItem {
  id: string
  title: string
  subtitle?: string
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
            <PressableContainer key={choice.id} onPress={() => onSelect(choice.id)}>
              <TitleContainer>
                <Title color={selectedValue === choice.id ? ColorsEnum.PRIMARY : ColorsEnum.BLACK}>
                  {choice.title}
                </Title>
                {!!choice.subtitle && <Subtitle>{choice.subtitle}</Subtitle>}
              </TitleContainer>

              {selectedValue === choice.id && <Validate color={ColorsEnum.PRIMARY} />}
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
