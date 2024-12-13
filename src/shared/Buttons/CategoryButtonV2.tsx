import React, { FunctionComponent } from 'react'
import { TouchableOpacityProps } from 'react-native'
import styled from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { getSpacing, TypoDS } from 'ui/theme'
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
  fillColor,
  borderColor,
  style,
  onPress,
}) => {
  const focusProps = useHandleFocus()
  const hoverProps = useHandleHover()

  return (
    <TouchableContainer
      {...focusProps}
      {...hoverProps}
      onMouseDown={(e) => e.preventDefault()} // Prevent focus on click
      onPress={onPress}
      accessibilityLabel={`Catégorie ${label}`}
      baseColor={fillColor}
      borderColor={borderColor}
      style={style}>
      <LabelContainer>
        <Label>{label.toUpperCase()}</Label>
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
}>(({ theme, isFocus, isHover, baseColor, borderColor }) => ({
  height: getSpacing(24.25),
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
  ...getHoverStyle(theme.colors.black, isHover),
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

const Label = styled(TypoDS.BodyAccentS).attrs({ numberOfLines: 3 })(({ theme }) => ({
  textAlign: 'left',
  color: theme.colors.black,
}))
