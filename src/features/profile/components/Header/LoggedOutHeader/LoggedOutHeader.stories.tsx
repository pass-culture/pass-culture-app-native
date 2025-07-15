import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { LoggedOutHeader } from 'features/profile/components/Header/LoggedOutHeader/LoggedOutHeader'
import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof LoggedOutHeader> = {
  title: 'features/Profile/Headers/LoggedOutHeader',
  component: LoggedOutHeader,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig: Variants<typeof LoggedOutHeader> = [
  { label: 'LoggedOutHeader', props: { featureFlags: { enablePassForAll: true } } },
]

export const Template: VariantsStory<typeof LoggedOutHeader> = {
  render: () => <VariantsTemplate variants={variantConfig} Component={LoggedOutHeader} />,
  name: 'LoggedOutHeader',
  parameters: {
    chromatic: { viewports: [theme.breakpoints.md, theme.breakpoints.lg, theme.breakpoints.xl] },
  },
}
