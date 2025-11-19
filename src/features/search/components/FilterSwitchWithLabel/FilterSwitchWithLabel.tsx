import React, { FunctionComponent, useMemo } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { Typo } from 'ui/theme'
import { HeadingLevel, getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  isActive: boolean
  toggle: () => void
  label: string
  testID?: string
  subtitle?: string
  accessibilityLevel?: HeadingLevel
  disabled?: boolean
}

export const FilterSwitchWithLabel: FunctionComponent<Props> = ({
  isActive,
  toggle,
  label,
  testID,
  subtitle,
  accessibilityLevel,
  disabled,
}) => {
  const checkboxID = uuidv4()
  const labelID = uuidv4()
  const labelDescriptionID = uuidv4()
  const { isDesktopViewport } = useTheme()

  const computedAccessibilityLabel = getComputedAccessibilityLabel(label, subtitle)

  const TitleWithSubtitle = useMemo(
    () => (
      <View
        accessibilityLabel={computedAccessibilityLabel}
        {...getHeadingAttrs(accessibilityLevel ?? 2)}
        accessible>
        <StyledInputLabel
          id={labelID}
          htmlFor={checkboxID}
          accessibilityDescribedBy={labelDescriptionID}>
          {label}
        </StyledInputLabel>
        {subtitle ? <Subtitle nativeID={labelDescriptionID}>{subtitle}</Subtitle> : null}
      </View>
    ),

    [
      accessibilityLevel,
      computedAccessibilityLabel,
      labelID,
      checkboxID,
      labelDescriptionID,
      label,
      subtitle,
    ]
  )

  return (
    <Container inverseLayout={!!isDesktopViewport}>
      {isDesktopViewport ? null : <TitleWrapper>{TitleWithSubtitle}</TitleWrapper>}
      <SwitchWrapper>
        <FilterSwitch
          checkboxID={checkboxID}
          active={isActive}
          toggle={toggle}
          accessibilityLabel={label}
          accessibilityLabelledBy={labelID}
          testID={testID}
          disabled={disabled}
        />
      </SwitchWrapper>
      {isDesktopViewport ? <TitleWrapper>{TitleWithSubtitle}</TitleWrapper> : null}
    </Container>
  )
}

const Container = styled.View<{ inverseLayout?: boolean }>(({ inverseLayout }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  ...(!inverseLayout && { justifyContent: 'space-between' }),
}))

const TitleWrapper = styled.View(({ theme }) => ({
  flexShrink: 1,
  marginRight: theme.designSystem.size.spacing.xl,
  marginLeft: theme.designSystem.size.spacing.s,
}))

const SwitchWrapper = styled.View({
  flexShrink: 0,
})

const StyledInputLabel = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.designSystem.typography.bodyAccent,
  color: theme.designSystem.color.text.default,
}))

const Subtitle = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
