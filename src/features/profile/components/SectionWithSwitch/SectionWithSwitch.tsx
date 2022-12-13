import React, { FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { styledInputLabel } from 'ui/components/InputLabel/styledInputLabel'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  accessibilityDescribedBy?: string
  title: string
  iconSize?: number
  icon?: FunctionComponent<IconInterface>
  active?: boolean
  toggle?: () => void
  toggleLabel?: string
  disabled?: boolean
}

export const SectionWithSwitch: React.FC<Props> = (props: Props) => {
  const { isMobileViewport } = useTheme()
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
    <Container>
      <TitleContainer toggleLabel={!!toggleLabel}>
        {!!Icon && (
          <React.Fragment>
            <Icon size={iconSize} />
            <Spacer.Row numberOfSpaces={2} />
          </React.Fragment>
        )}
        <InputLabel id={labelID} htmlFor={checkboxID}>
          <Typo.ButtonText>{title}</Typo.ButtonText>
        </InputLabel>
      </TitleContainer>
      <FilterSwitchLabelContainer>
        {toggleLabel && !isMobileViewport ? (
          <ToggleLabel id={labelID} htmlFor={checkboxID}>
            {toggleLabel}
          </ToggleLabel>
        ) : null}
        <Spacer.Row numberOfSpaces={5} />
        <FilterSwitch
          checkboxID={checkboxID}
          active={active}
          toggle={toggle}
          disabled={disabled}
          accessibilityLabelledBy={labelID}
          accessibilityDescribedBy={accessibilityDescribedBy}
        />
      </FilterSwitchLabelContainer>
    </Container>
  )
}

const Container = styled.View({
  paddingVertical: getSpacing(4),
  flexDirection: 'row',
  alignItems: 'center',
})

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
  ...theme.typography.caption,
  color: theme.colors.greyDark,
}))
