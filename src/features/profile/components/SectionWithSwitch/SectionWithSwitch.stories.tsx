import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { theme } from 'theme'

import { SectionWithSwitch } from './SectionWithSwitch'

const meta: Meta<typeof SectionWithSwitch> = {
  title: 'ui/sections/SectionWithSwitch',
  component: SectionWithSwitch,
  parameters: {
    chromatic: { viewports: [theme.breakpoints.sm, theme.breakpoints.md, theme.breakpoints.lg] },
  },
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof SectionWithSwitch>

export const Template: Story = {
  render: () => <SectionWithSwitch title="Section with switch title" toggleLabel="Toggle label" />,
  name: 'SectionWithSwitch',
}
