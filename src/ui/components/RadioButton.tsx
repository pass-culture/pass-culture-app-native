import React from 'react'
import styled from 'styled-components/native'
import { useTheme } from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { Validate as DefaultValidate } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface RadioButtonProps {
  id: string
  title: string
  description?: string
  onSelect: (value: string) => void
  selectedValue: string
}

export function RadioButton(props: RadioButtonProps) {
  const { isMobileViewport } = useTheme()
  const TitleContainer = isMobileViewport ? TitleContainerFlex : TitleContainerWithMarginRight

  const selected = props.selectedValue === props.id
  return (
    <PressableContainer
      key={props.id}
      onPress={() => props.onSelect(props.id)}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      testID={`radio-button-${props.id}`}>
      <TitleContainer>
        <Title isSelected={selected}>{props.title}</Title>
        {!!props.description && <Subtitle>{props.description}</Subtitle>}
      </TitleContainer>
      <Spacer.Flex flex={0.1}>{!!selected && <Validate />}</Spacer.Flex>
    </PressableContainer>
  )
}

const Validate = styled(DefaultValidate).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))``

const PressableContainer = styled(TouchableOpacity)(({ theme }) => ({
  minHeight: theme.icons.sizes.small,
  flexDirection: 'row',
  width: '100%',
  alignItems: 'center',
  justifyContent: theme.isMobileViewport ? 'space-between' : undefined,
}))

const TitleContainerFlex = styled(Spacer.Flex).attrs({
  flex: 0.9,
})``

const TitleContainerWithMarginRight = styled.View({
  marginRight: getSpacing(6),
})

const Title = styled(Typo.ButtonText)<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.black,
}))

const Subtitle = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
