import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel'

export default {
  title: 'Features/Search/FilterSwitchWithLabel',
  component: FilterSwitchWithLabel,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof FilterSwitchWithLabel>

const Template: ComponentStory<typeof FilterSwitchWithLabel> = (props) => (
  <FilterSwitchWithLabel {...props} />
)

export const Default = Template.bind({})
Default.args = {
  isActive: true,
  label: 'Ceci est un label',
}
