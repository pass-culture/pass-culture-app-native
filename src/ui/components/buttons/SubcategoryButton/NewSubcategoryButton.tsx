import React from 'react'
import { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { getSearchPropConfig } from 'features/navigation/navigators/SearchStackNavigator/getSearchPropConfig'
import { SearchState } from 'features/search/types'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useHandleHover } from 'libs/hooks/useHandleHover'
import {
  useMobileFontScaleToDisplay,
  useNumberOfLine,
} from 'shared/accessibility/helpers/zoomHelpers'
import { ColorsType } from 'theme/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo, getSpacing } from 'ui/theme'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

const SUBCATEGORY_BUTTON_HEIGHT = 80
const SUBCATEGORY_BUTTON_WIDTH = 156
const MIN_HEIGHT = getSpacing(16)

type SubcategoryButtonProps = {
  label: string
  backgroundColor: ColorsType
  borderColor: ColorsType
  position?: number
  searchParams: SearchState
  onBeforeNavigate: VoidFunction
  onLayout?: (event: LayoutChangeEvent) => void
  style?: StyleProp<ViewStyle>
  fullWidth?: boolean
  labelParts?: readonly string[]
}

export const NewSubcategoryButton = ({
  label,
  backgroundColor,
  borderColor,
  searchParams,
  onBeforeNavigate,
  onLayout,
  style,
  fullWidth,
  labelParts,
}: SubcategoryButtonProps) => {
  const shouldUseAccessibleLayout = useMobileFontScaleToDisplay({
    default: false,
    at200PercentZoom: true,
  })
  const labelPartsToDisplay = shouldUseAccessibleLayout ? [label] : (labelParts ?? [label])
  const effectiveHeight = useMobileFontScaleToDisplay({
    default: SUBCATEGORY_BUTTON_HEIGHT,
    at200PercentZoom: undefined,
  })

  const focusProps = useHandleFocus()
  const hoverProps = useHandleHover()
  const numberOfLines = useNumberOfLine(3)

  return (
    <TouchableContainer
      {...focusProps}
      {...hoverProps}
      onMouseDown={(e: Event) => e.preventDefault()} // Prevent focus on click
      onBeforeNavigate={onBeforeNavigate}
      navigateTo={getSearchPropConfig('SearchResults', searchParams)}
      testID={`SubcategoryButton ${label}`}
      accessibilityLabel={`Sous-catégorie ${labelPartsToDisplay.join(' ')}`}
      baseColor={backgroundColor}
      borderColor={borderColor}
      onLayout={onLayout}
      height={effectiveHeight}
      fullWidth={fullWidth}
      style={style}>
      {shouldUseAccessibleLayout ? (
        <AccessibleLabelContainer>
          <Label {...setTextSemantic('span')} numberOfLines={numberOfLines}>
            {label}
          </Label>
        </AccessibleLabelContainer>
      ) : (
        <Container gap={2}>
          <LabelContainer>
            {labelPartsToDisplay.map((labelPart) => (
              <Label key={labelPart} {...setTextSemantic('span')}>
                {labelPart}
              </Label>
            ))}
          </LabelContainer>
        </Container>
      )}
    </TouchableContainer>
  )
}

const TouchableContainer: typeof InternalTouchableLink = styled(InternalTouchableLink)<{
  onMouseDown: (e: Event) => void
  isFocus?: boolean
  isHover?: boolean
  baseColor: ColorsType
  borderColor: ColorsType
  height?: number
  fullWidth?: boolean
}>(({ theme, isFocus, isHover, baseColor, borderColor, height, fullWidth }) => ({
  width: fullWidth || !theme.isMobileViewport ? '100%' : SUBCATEGORY_BUTTON_WIDTH,
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
  borderWidth: 1.6,
  borderStyle: 'solid',
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

const Label = styled(Typo.BodyAccentXs).attrs({
  ellipsizeMode: 'tail',
})(({ theme }) => ({
  textAlign: 'left',
  color: theme.designSystem.color.text.default,
  backgroundColor: theme.designSystem.color.text.inverted,
  borderRadius: theme.designSystem.size.borderRadius.s,
  paddingTop: theme.designSystem.size.spacing.xxs,
  paddingBottom: theme.designSystem.size.spacing.xxs,
  paddingLeft: theme.designSystem.size.spacing.xs,
  paddingRight: theme.designSystem.size.spacing.xs,
}))
