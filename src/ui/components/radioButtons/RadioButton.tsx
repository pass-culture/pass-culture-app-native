import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { IconInterface } from 'ui/svg/icons/types'
import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface RadioButtonProps {
  label: string
  description?: string
  onSelect: (value: string) => void
  isSelected: boolean
  icon?: FunctionComponent<IconInterface>
  accessibilityLabel?: string
  testID?: string
  marginVertical?: number
}

export function RadioButton(props: RadioButtonProps) {
  const { isMobileViewport } = useTheme()
  const LabelContainer = isMobileViewport ? LabelContainerFlex : LabelContainerWithMarginRight
  const StyledIcon =
    !!props.icon &&
    styled(props.icon).attrs(({ theme }) => ({
      color: theme.colors.primary,
      color2: props.isSelected ? theme.colors.primary : theme.colors.secondary,
      size: theme.icons.sizes.small,
    }))``

  return (
    <StyledTouchableOpacity
      accessibilityRole="radio"
      accessibilityState={{ checked: props.isSelected }}
      accessibilityLabel={props.accessibilityLabel}
      onPress={() => props.onSelect(props.label)}
      marginVertical={props.marginVertical ?? 0}
      testID={props.testID}>
      <LabelContainer>
        {!!StyledIcon && (
          <React.Fragment>
            <StyledIcon />
            <Spacer.Row numberOfSpaces={4} />
          </React.Fragment>
        )}
        <View>
          <Label isSelected={props.isSelected}>{props.label}</Label>
          {!!props.description && <Subtitle>{props.description}</Subtitle>}
        </View>
      </LabelContainer>
      <Spacer.Flex flex={0.1}>{!!props.isSelected && <ValidateIconPrimary />}</Spacer.Flex>
    </StyledTouchableOpacity>
  )
}

const LabelContainerFlex = styled(Spacer.Flex).attrs({
  flex: 0.9,
})({
  flexDirection: 'row',
  alignItems: 'center',
})

const LabelContainerWithMarginRight = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: theme.isMobileViewport ? 0 : getSpacing(6),
}))

const Subtitle = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const StyledTouchableOpacity = styled(TouchableOpacity)<{ marginVertical: number }>(
  ({ theme, marginVertical }) => ({
    minHeight: theme.icons.sizes.small,
    marginVertical: marginVertical,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: theme.isMobileViewport ? 'space-between' : undefined,
  })
)

const Label = styled(Typo.ButtonText).attrs({
  numberOfLines: 2,
})<{ isSelected: boolean }>(({ isSelected, theme }) => ({
  color: isSelected ? theme.colors.primary : theme.colors.black,
}))

const ValidateIconPrimary = styled(Validate).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))``
