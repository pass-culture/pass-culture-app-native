import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  accessibilityDescribedBy?: string
  title: string
  iconSize?: number
  icon?: FunctionComponent<AccessibleIcon>
  active?: boolean
  toggle?: () => void
  toggleLabel?: string
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
    accessibilityDescribedBy,
  } = props
  const Icon = icon

  return (
    <Container toggleLabel={!!toggleLabel}>
      <TitleContainer toggleLabel={!!toggleLabel}>
        {Icon ? (
          <React.Fragment>
            <Icon size={iconSize} color={designSystem.color.icon.default} />
            <Spacer.Row numberOfSpaces={2} />
          </React.Fragment>
        ) : null}
        <InputLabel htmlFor={checkboxID}>
          <Typo.BodyAccent>{title}</Typo.BodyAccent>
        </InputLabel>
      </TitleContainer>
      <Spacer.Row numberOfSpaces={4} />
      <FilterSwitchLabelContainer>
        {toggleLabel && !isMobileViewport ? (
          <React.Fragment>
            <ToggleLabel id={labelID} htmlFor={checkboxID}>
              {toggleLabel}
            </ToggleLabel>
            <Spacer.Row numberOfSpaces={4} />
          </React.Fragment>
        ) : null}
        <FilterSwitch
          checkboxID={checkboxID}
          active={active}
          toggle={toggle}
          disabled={disabled}
          accessibilityLabelledBy={labelID}
          accessibilityDescribedBy={accessibilityDescribedBy}
          testID={title}
        />
      </FilterSwitchLabelContainer>
    </Container>
  )
}

const Container = styled.View<{ toggleLabel?: boolean }>(({ theme, toggleLabel }) => ({
  flexDirection: theme.isMobileViewport || toggleLabel ? 'row' : 'row-reverse',
  justifyContent: theme.isMobileViewport || toggleLabel ? 'flex-start' : 'flex-end',
  alignItems: 'center',
}))

const TitleContainer = styled.View<{ toggleLabel?: boolean }>(({ theme, toggleLabel }) => ({
  flex: theme.isMobileViewport || toggleLabel ? 1 : undefined,
  flexDirection: 'row',
  alignItems: 'center',
}))

const FilterSwitchLabelContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const ToggleLabel = styledInputLabel(InputLabel)(({ theme }) => ({
  ...theme.designSystem.typography.bodyAccentXs,
  color: theme.designSystem.color.text.subtle,
}))
