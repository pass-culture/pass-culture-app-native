import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import FilterSwitch from './FilterSwitch'

const meta: Meta<typeof FilterSwitch> = {
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

const variantConfig: Variants<typeof FilterSwitch> = [
  {
    label: 'FilterSwitch inactive',
    props: { active: false, accessibilityLabel: 'FilterSwitch inactive' },
  },
  {
    label: 'FilterSwitch inactive disabled',
    props: { active: false, accessibilityLabel: 'FilterSwitch inactive disabled', disabled: true },
  },
  {
    label: 'FilterSwitch active',
    props: { active: true, accessibilityLabel: 'FilterSwitch active' },
  },
  {
    label: 'FilterSwitch active disabled',
    props: { active: true, accessibilityLabel: 'FilterSwitch active disabled', disabled: true },
  },
]

export const Template: VariantsStory<typeof FilterSwitch> = {
  name: 'FilterSwitch',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={FilterSwitch}
      defaultProps={{ ...props }}
    />
  ),
}
