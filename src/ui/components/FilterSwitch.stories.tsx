import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { Spacer } from 'ui/components/spacer/Spacer'
import { Typo } from 'ui/theme'

import FilterSwitch from './FilterSwitch'

export default {
  title: 'ui/FilterSwitch',
  component: FilterSwitch,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof FilterSwitch>

const Template: ComponentStory<typeof FilterSwitch> = (props) => (
  <StyledView>
    <Typo.Body nativeID="filter-switch-id">{'Switch label'}</Typo.Body>
    <Spacer.Row numberOfSpaces={2} />
    <FilterSwitch {...props} accessibilityLabelledBy="filter-switch-id" />
  </StyledView>
)

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

const StyledView = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
