import React, { FunctionComponent } from 'react'
import type { ImageSourcePropType } from 'react-native'
import styled from 'styled-components/native'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import { useMobileFontScaleToDisplay } from 'shared/accessibility/helpers/zoomHelpers'
import { ColorsType } from 'theme/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import {
  InternalNavigationProps,
  InternalTouchableLinkProps,
} from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo, getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type CategoryButtonProps = {
  label: string
  navigateTo: InternalNavigationProps['navigateTo']
  onBeforeNavigate?: () => void
  height?: number
  style?: InternalTouchableLinkProps['style']
  fillColor: ColorsType
  borderColor: ColorsType
  imageSource?: ImageSourcePropType
  labelParts?: readonly string[]
}

export const NewCategoryButton: FunctionComponent<CategoryButtonProps> = ({
  label,
  fillColor,
  borderColor,
  style,
  navigateTo,
  onBeforeNavigate,
  height,
  imageSource,
  labelParts,
}) => {
  const shouldUseAccessibleLayout = useMobileFontScaleToDisplay({
    default: false,
    at200PercentZoom: true,
  })
  const labelPartsToDisplay = shouldUseAccessibleLayout ? [label] : (labelParts ?? [label])
  const imageSourceToDisplay = shouldUseAccessibleLayout ? undefined : imageSource
  const effectiveHeight = useMobileFontScaleToDisplay({
    default: height,
    at200PercentZoom: undefined,
  })

  const focusProps = useHandleFocus()
  const hoverProps = useHandleHover()

  return (
    <TouchableContainer
      {...focusProps}
      {...hoverProps}
      onMouseDown={(e: Event) => e.preventDefault()} // Prevent focus on click
      navigateTo={navigateTo}
      onBeforeNavigate={onBeforeNavigate}
      accessibilityLabel={`Catégorie ${labelPartsToDisplay.join(' ')}`}
      baseColor={fillColor}
      borderColor={borderColor}
      style={style}
      height={effectiveHeight}>
      {shouldUseAccessibleLayout ? (
        <AccessibleLabelContainer>
          <Label>{label}</Label>
        </AccessibleLabelContainer>
      ) : (
        <Container gap={2}>
          <LabelContainer>
            {labelPartsToDisplay.map((labelPart) => (
              <Label key={labelPart}>{labelPart}</Label>
            ))}
          </LabelContainer>
          {imageSourceToDisplay ? <CategoryIcon source={imageSourceToDisplay} /> : null}
        </Container>
      )}
    </TouchableContainer>
  )
}

const MIN_HEIGHT = getSpacing(20)
const CATEGORY_ICON_SIZE = getSpacing(24)
const CATEGORY_ICON_TOP = getSpacing(1.25)

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
  borderTopLeftRadius: theme.designSystem.size.borderRadius.l,
  borderTopRightRadius: theme.designSystem.size.borderRadius.l,
  borderBottomRightRadius: theme.designSystem.size.borderRadius.l,
  borderBottomLeftRadius: 0,
  ...customFocusOutline({ theme, isFocus }),
  ...getHoverStyle({ underlineColor: theme.designSystem.color.text.default, isHover }),
  backgroundColor: baseColor,
  borderColor,
  borderWidth: '1.6px',
  flexDirection: 'column',
  display: 'flex',
  justifyContent: height ? 'flex-end' : undefined,
}))

const Container = styled(ViewGap)(({ theme }) => ({
  padding: theme.designSystem.size.spacing.s,
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  flexDirection: 'row',
  flex: 1,
}))

const LabelContainer = styled.View(({ theme }) => ({
  alignItems: 'flex-start',
  gap: theme.designSystem.size.spacing.xs,
  marginLeft: theme.designSystem.size.spacing.xxs,
  marginBottom: theme.designSystem.size.spacing.xs,
  transform: 'rotate(-3deg)',
  flex: 1,
  zIndex: 1,
  alignSelf: 'flex-end',
}))

const AccessibleLabelContainer = styled.View(({ theme }) => ({
  padding: theme.designSystem.size.spacing.s,
  width: '100%',
  alignItems: 'flex-start',
}))

const Label = styled(Typo.BodyAccentS).attrs({ numberOfLines: 4 })(({ theme }) => ({
  textAlign: 'left',
  color: theme.designSystem.color.text.default,
  backgroundColor: theme.designSystem.color.text.inverted,
  borderRadius: theme.designSystem.size.borderRadius.s,
  paddingVertical: theme.designSystem.size.spacing.xxs,
  paddingHorizontal: theme.designSystem.size.spacing.xs,
}))

const CategoryIcon = styled.Image({
  position: 'absolute',
  right: 0,
  top: CATEGORY_ICON_TOP,
  width: CATEGORY_ICON_SIZE,
  height: CATEGORY_ICON_SIZE,
  resizeMode: 'contain',
})
