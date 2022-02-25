import { ComponentStory, ComponentMeta } from '@storybook/react'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { InputLabel } from 'ui/components/InputLabel'

import FilterSwitch from './FilterSwitch'

export default {
  title: 'ui/FilterSwitch',
  component: FilterSwitch,
} as ComponentMeta<typeof FilterSwitch>

const Template: ComponentStory<typeof FilterSwitch> = (props) => <FilterSwitch {...props} />

export const Inactive = Template.bind({})
Inactive.args = {
  active: false,
  accessibilityLabel: 'Interrupteur inactif',
}

export const Active = Template.bind({})
Active.args = {
  active: true,
  accessibilityLabel: 'Interrupteur actif',
}

export const InactiveDisabled = Template.bind({})
InactiveDisabled.args = {
  active: false,
  disabled: true,
  accessibilityLabel: 'Interrupteur inactif désactivé',
}

export const ActiveDisabled = Template.bind({})
ActiveDisabled.args = {
  active: true,
  disabled: true,
  accessibilityLabel: 'Interrupteur actif désactivé',
}

export const SwitchWithLabel: ComponentStory<typeof FilterSwitch> = (props) => {
  const checkboxID = 'checkboxID'
  const [active, setActive] = useState(false)
  const switchLabel = 'Switch label'

  return (
    <StyledView>
      <InputLabel htmlFor={checkboxID}>{switchLabel}</InputLabel>
      <FilterSwitch
        {...props}
        active={active}
        checkboxID={checkboxID}
        toggle={() => setActive((prevState) => !prevState)}
      />
    </StyledView>
  )
}

const StyledView = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
