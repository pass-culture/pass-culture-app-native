import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { theme } from 'theme'

import { SectionWithSwitch } from './SectionWithSwitch'

const meta: ComponentMeta<typeof SectionWithSwitch> = {
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

export const Template: ComponentStory<typeof SectionWithSwitch> = () => (
  <SectionWithSwitch title="Section with switch title" toggleLabel="Toggle label" />
)
Template.storyName = 'SectionWithSwitch'
