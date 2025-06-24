import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { ColorsTypeLegacy } from 'theme/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import {
  InternalNavigationProps,
  InternalTouchableLinkProps,
} from 'ui/components/touchableLink/types'
import { getSpacing, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

export type CategoryButtonProps = {
  label: string
  navigateTo: InternalNavigationProps['navigateTo']
  onBeforeNavigate?: () => void
  height?: number
  style?: InternalTouchableLinkProps['style']
  fillColor: ColorsTypeLegacy
  borderColor: ColorsTypeLegacy
}
export const CategoryButton: FunctionComponent<CategoryButtonProps> = ({
  label,
  fillColor,
  borderColor,
  style,
  navigateTo,
  onBeforeNavigate,
  height,
}) => {
  const focusProps = useHandleFocus()
  const hoverProps = useHandleHover()

  return (
    <TouchableContainer
      {...focusProps}
      {...hoverProps}
      onMouseDown={(e: Event) => e.preventDefault()} // Prevent focus on click
      navigateTo={navigateTo}
      onBeforeNavigate={onBeforeNavigate}
      accessibilityLabel={`Catégorie ${label}`}
      baseColor={fillColor}
      borderColor={borderColor}
      style={style}
      height={height}>
      <LabelContainer>
        <Label>{label.toUpperCase()}</Label>
      </LabelContainer>
    </TouchableContainer>
  )
}

const TouchableContainer: typeof InternalTouchableLink = styled(InternalTouchableLink)<{
  onMouseDown: (e: Event) => void
  isFocus: boolean
  isHover: boolean
  baseColor: ColorsEnum
  borderColor: ColorsEnum
  height?: number
}>(({ theme, isFocus, isHover, baseColor, borderColor, height }) => ({
  height,
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus }),
  ...getHoverStyle({ underlineColor: theme.designSystem.color.text.default, isHover }),
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

const Label = styled(Typo.BodyAccentS).attrs({ numberOfLines: 3 })(({ theme }) => ({
  textAlign: 'left',
  color: theme.designSystem.color.text.default,
}))
