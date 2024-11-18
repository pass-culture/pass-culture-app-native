import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import FilterSwitch from './FilterSwitch'

const meta: ComponentMeta<typeof FilterSwitch> = {
  title: 'ui/FilterSwitch',
  component: FilterSwitch,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig = [
  {
    label: 'FilterSwitch inactive',
    props: { active: false },
  },
  {
    label: 'FilterSwitch inactive disabled',
    props: { active: false, disabled: true },
  },
  {
    label: 'FilterSwitch active',
    props: { active: true },
  },
  {
    label: 'FilterSwitch active disabled',
    props: { active: true, disabled: true },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={FilterSwitch} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'FilterSwitch'
