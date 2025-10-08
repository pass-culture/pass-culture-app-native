import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Typo } from 'ui/theme'

interface Props {
  accessibilityHint?: string
  title: string
  toggle: () => void
  toggleLabel?: string
  iconSize?: number
  icon?: FunctionComponent<AccessibleIcon>
  active?: boolean
  disabled?: boolean
}

export const SectionWithSwitch: React.FC<Props> = (props: Props) => {
  const { isMobileViewport, designSystem } = useTheme()
  const labelID = uuidv4()
  const checkboxID = uuidv4()
  const {
    icon,
    iconSize,
    title,
    active = false,
    toggle = () => null,
    toggleLabel,
    disabled,
    accessibilityHint,
  } = props
  const Icon = icon

  return (
    <Container toggleLabel={!!toggleLabel} gap={4}>
      <TitleContainer toggleLabel={!!toggleLabel} gap={2}>
        {Icon ? <Icon size={iconSize} color={designSystem.color.icon.default} /> : null}
        <InputLabel htmlFor={checkboxID}>
          <Typo.BodyAccent>{title}</Typo.BodyAccent>
        </InputLabel>
      </TitleContainer>
      <FilterSwitchLabelContainer gap={4}>
        {toggleLabel && !isMobileViewport ? (
          <ToggleLabel id={labelID} htmlFor={checkboxID}>
            {toggleLabel}
          </ToggleLabel>
        ) : null}
        <FilterSwitch
          checkboxID={checkboxID}
          active={active}
          toggle={toggle}
          disabled={disabled}
          accessibilityLabelledBy={labelID}
          accessibilityLabel={toggleLabel ?? title}
          accessibilityHint={accessibilityHint}
          testID={title}
        />
      </FilterSwitchLabelContainer>
    </Container>
  )
}

const Container = styled(ViewGap)<{ toggleLabel?: boolean }>(({ theme, toggleLabel }) => ({
  flexDirection: theme.isMobileViewport || toggleLabel ? 'row' : 'row-reverse',
  justifyContent: theme.isMobileViewport || toggleLabel ? 'flex-start' : 'flex-end',
  alignItems: 'center',
}))

const TitleContainer = styled(ViewGap)<{ toggleLabel?: boolean }>(({ theme, toggleLabel }) => ({
  flex: theme.isMobileViewport || toggleLabel ? 1 : undefined,
  flexDirection: 'row',
  alignItems: 'center',
}))

const FilterSwitchLabelContainer = styled(ViewGap)({
  flexDirection: 'row',
  alignItems: 'center',
})

const ToggleLabel = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.designSystem.typography.bodyAccentXs,
  color: theme.designSystem.color.text.subtle,
}))
