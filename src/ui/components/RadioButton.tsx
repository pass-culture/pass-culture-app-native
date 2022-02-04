import React from 'react'
import styled from 'styled-components/native'

import { Validate as DefaultValidate } from 'ui/svg/icons/Validate'
import { Spacer, Typo } from 'ui/theme'
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
          <Title match={props.selectedValue === props.id}>{props.title}</Title>
          {!!props.description && <Subtitle>{props.description}</Subtitle>}
        </Spacer.Flex>

        <Spacer.Flex flex={0.1}>{props.selectedValue === props.id && <Validate />}</Spacer.Flex>
      </PressableContainer>
    </React.Fragment>
  )
}

const Validate = styled(DefaultValidate).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))``

const PressableContainer = styled.TouchableOpacity({
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const Title = styled(Typo.ButtonText)<{ match: boolean }>(({ match, theme }) => ({
  color: match ? theme.colors.primary : theme.colors.black,
}))

const Subtitle = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
