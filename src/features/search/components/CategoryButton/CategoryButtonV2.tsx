import React, { FunctionComponent } from 'react'
import { TouchableOpacityProps } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type CategoryButtonV2Props = {
  label: string
  textColor: ColorsEnum
  fillColor: ColorsEnum
  borderColor: ColorsEnum
  style?: TouchableOpacityProps['style']
  onPress?: () => void
  children?: never
}

export const CategoryButtonV2: FunctionComponent<CategoryButtonV2Props> = ({
  label,
  textColor,
  fillColor,
  borderColor,
  style,
  onPress,
}) => {
  const focusProps = useHandleFocus()
  const hoverProps = useHandleHover()
  const { colors } = useTheme()

  return (
    <TouchableContainer
      {...focusProps}
      {...hoverProps}
      onMouseDown={(e) => e.preventDefault()} // Prevent focus on click
      onPress={onPress}
      accessibilityLabel={`Catégorie ${label}`}
      baseColor={fillColor}
      borderColor={borderColor}
      textColor={textColor}
      style={style}>
      <LabelContainer>
        <Label baseColor={colors.black}>{label.toUpperCase()}</Label>
      </LabelContainer>
    </TouchableContainer>
  )
}

const TouchableContainer = styled(TouchableOpacity)<{
  onMouseDown: (e: Event) => void
  isFocus: boolean
  isHover: boolean
  baseColor: ColorsEnum
  borderColor: ColorsEnum
  textColor: ColorsEnum
}>(({ theme, isFocus, isHover, baseColor, borderColor, textColor }) => ({
  height: getSpacing(24.25),
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
  ...getHoverStyle(textColor, isHover),
  backgroundColor: baseColor,
  borderColor,
  borderWidth: '1.6px',
  flexDirection: 'column',
  display: 'flex',
  justifyContent: 'flex-end',
}))

const LabelContainer = styled.View({
  padding: getSpacing(2),
  width: '100%',
  alignItems: 'flex-start',
})

const Label = styled(Typo.ButtonText).attrs({ numberOfLines: 3 })<{ baseColor?: string }>(
  ({ baseColor }) => ({
    textAlign: 'left',
    color: baseColor,
  })
)
