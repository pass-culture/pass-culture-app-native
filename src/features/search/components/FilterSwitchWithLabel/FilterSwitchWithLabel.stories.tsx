import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel/FilterSwitchWithLabel'

const meta: Meta<typeof FilterSwitchWithLabel> = {
  title: 'Features/search/FilterSwitchWithLabel',
  component: FilterSwitchWithLabel,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof FilterSwitchWithLabel>

export const Default: Story = {
  render: (props) => <FilterSwitchWithLabel {...props} />,
  args: {
    isActive: true,
    label: 'Ceci est un label',
  },
}

export const WithSubtitle: Story = {
  render: (props) => <FilterSwitchWithLabel {...props} />,
  args: {
    isActive: true,
    label: 'Ceci est un label',
    subtitle: 'Ceci est un sous-titre',
  },
}
