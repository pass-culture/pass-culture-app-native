import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import FilterSwitch from './FilterSwitch'

export default {
  title: 'ui/FilterSwitch',
  component: FilterSwitch,
  parameters: {
    axe: { disabledRules: ['aria-toggle-field-name'] },
  },
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
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
