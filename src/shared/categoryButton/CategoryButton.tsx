import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { useFontScaleValue } from 'shared/accessibility/useFontScaleValue'
import { ColorsType } from 'theme/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import {
  InternalNavigationProps,
  InternalTouchableLinkProps,
} from 'ui/components/touchableLink/types'
import { Typo, getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

export type CategoryButtonProps = {
  label: string
  navigateTo: InternalNavigationProps['navigateTo']
  onBeforeNavigate?: () => void
  height?: number
  style?: InternalTouchableLinkProps['style']
  fillColor: ColorsType
  borderColor: ColorsType
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
  const effectiveHeight = useFontScaleValue({ default: height, at200PercentZoom: undefined })

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
      height={effectiveHeight}>
      <LabelContainer>
        <Label>{label.toUpperCase()}</Label>
      </LabelContainer>
    </TouchableContainer>
  )
}

const MIN_HEIGHT = getSpacing(20)

const TouchableContainer: typeof InternalTouchableLink = styled(InternalTouchableLink)<{
  onMouseDown: (e: Event) => void
  isFocus: boolean
  isHover: boolean
  baseColor: ColorsType
  borderColor: ColorsType
  height?: number
}>(({ theme, isFocus, isHover, baseColor, borderColor, height }) => ({
  height: height ?? undefined,
  minHeight: MIN_HEIGHT,
  overflow: 'hidden',
  borderRadius: theme.designSystem.size.borderRadius.m,
  ...customFocusOutline({ isFocus }),
  ...getHoverStyle({ underlineColor: theme.designSystem.color.text.default, isHover }),
  backgroundColor: baseColor,
  borderColor,
  borderWidth: '1.6px',
  flexDirection: 'column',
  display: 'flex',
  justifyContent: height ? 'flex-end' : undefined,
}))

const LabelContainer = styled.View(({ theme }) => ({
  padding: theme.designSystem.size.spacing.s,
  width: '100%',
  alignItems: 'flex-start',
}))

const Label = styled(Typo.BodyAccentS).attrs({ numberOfLines: 4 })(({ theme }) => ({
  textAlign: 'left',
  color: theme.designSystem.color.text.default,
}))
