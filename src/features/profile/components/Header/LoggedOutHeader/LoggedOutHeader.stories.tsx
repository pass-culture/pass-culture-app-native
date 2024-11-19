import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { LoggedOutHeader } from 'features/profile/components/Header/LoggedOutHeader/LoggedOutHeader'
import { theme } from 'theme'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

const meta: ComponentMeta<typeof LoggedOutHeader> = {
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

const variantConfig = [
  {
    label: 'LoggedOutHeader',
    parameters: {
      chromatic: {
        viewports: [theme.breakpoints.md, theme.breakpoints.lg, theme.breakpoints.xl],
      },
    },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={LoggedOutHeader} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'LoggedOutHeader'
