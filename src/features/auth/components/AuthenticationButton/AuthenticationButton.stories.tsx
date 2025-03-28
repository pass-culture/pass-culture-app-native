import { NavigationContainer } from '@react-navigation/native'
import { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants } from 'ui/storybook/VariantsTemplate'

import { AuthenticationButton } from './AuthenticationButton'

const meta: Meta<typeof AuthenticationButton> = {
  title: 'Features/auth/AuthenticationButton',
  component: AuthenticationButton,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig: Variants<typeof AuthenticationButton> = [
  {
    label: 'AuthenticationButton login',
    props: { type: 'login' },
  },
  {
    label: 'AuthenticationButton signup',
    props: { type: 'signup' },
  },
]

type Story = StoryObj<typeof AuthenticationButton>

const Template = (args: React.ComponentProps<typeof AuthenticationButton>) => (
  <VariantsTemplate variants={variantConfig} Component={AuthenticationButton} defaultProps={args} />
)

export const AllVariants: Story = {
  render: Template,
}
