import React, { FunctionComponent, useMemo } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs, HeadingLevel } from 'ui/theme/typographyAttrs/getHeadingAttrs'

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
  const checkboxID = useMemo(uuidv4, [])
  const labelID = useMemo(uuidv4, [])
  const describedByID = useMemo(uuidv4, [])
  const labelDescriptionID = useMemo(uuidv4, [])
  const { isDesktopViewport } = useTheme()

  const TitleWithSubtitle = useMemo(
    () => (
      <React.Fragment>
        <StyledInputLabel
          {...getHeadingAttrs(accessibilityLevel ?? 2)}
          id={labelID}
          htmlFor={checkboxID}
          accessibilityDescribedBy={labelDescriptionID}>
          {label}
        </StyledInputLabel>
        {subtitle ? <Subtitle nativeID={labelDescriptionID}>{subtitle}</Subtitle> : null}
      </React.Fragment>
    ),

    [accessibilityLevel, label, labelID, labelDescriptionID, checkboxID, subtitle]
  )

  return (
    <Container inverseLayout={!!isDesktopViewport}>
      {isDesktopViewport ? null : (
        <React.Fragment>
          <TitleWrapper>{TitleWithSubtitle}</TitleWrapper>
          <Spacer.Row numberOfSpaces={6} />
        </React.Fragment>
      )}
      <SwitchWrapper>
        <FilterSwitch
          checkboxID={checkboxID}
          active={isActive}
          toggle={toggle}
          accessibilityLabelledBy={labelID}
          accessibilityDescribedBy={describedByID}
          testID={testID}
          disabled={disabled}
        />
      </SwitchWrapper>
      {isDesktopViewport ? (
        <React.Fragment>
          <Spacer.Row numberOfSpaces={2} />
          <TitleWrapper>{TitleWithSubtitle}</TitleWrapper>
        </React.Fragment>
      ) : null}
    </Container>
  )
}

const Container = styled.View<{ inverseLayout?: boolean }>(({ inverseLayout }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  ...(!inverseLayout && { justifyContent: 'space-between' }),
}))

const TitleWrapper = styled.View({
  flexShrink: 1,
})

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
