import { ComponentStory, ComponentMeta } from '@storybook/react'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { Spacer } from 'ui/components/spacer/Spacer'

import FilterSwitch from './FilterSwitch'

export default {
  title: 'ui/FilterSwitch',
  component: FilterSwitch,
} as ComponentMeta<typeof FilterSwitch>

const Template: ComponentStory<typeof FilterSwitch> = (props) => <FilterSwitch {...props} />

export const Inactive = Template.bind({})
Inactive.args = {
  active: false,
}

export const Active = Template.bind({})
Active.args = {
  active: true,
}

export const InactiveDisabled = Template.bind({})
InactiveDisabled.args = {
  active: false,
  disabled: true,
}

export const ActiveDisabled = Template.bind({})
ActiveDisabled.args = {
  active: true,
  disabled: true,
}

export const SwitchWithLabel: ComponentStory<typeof FilterSwitch> = (props) => {
  const checkboxID = 'checkboxID'
  const [active, setActive] = useState(false)
  const switchLabel = 'Switch label'

  return (
    <StyledView>
      <InputLabel htmlFor={checkboxID}>{switchLabel}</InputLabel>
      <Spacer.Row numberOfSpaces={5} />
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
