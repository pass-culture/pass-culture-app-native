import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel/FilterSwitchWithLabel'

export default {
  title: 'Features/search/FilterSwitchWithLabel',
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
export const WithSubtitle = Template.bind({})
WithSubtitle.args = {
  isActive: true,
  label: 'Ceci est un label',
  subtitle: 'Ceci est un sous-titre',
}
