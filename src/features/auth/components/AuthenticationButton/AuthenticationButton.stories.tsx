import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { AuthenticationButton } from './AuthenticationButton'

const meta: ComponentMeta<typeof AuthenticationButton> = {
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

const variantConfig = [
  {
    label: 'AuthenticationButton round price',
    props: { type: 'login' },
  },
  {
    label: 'AuthenticationButton decimal price',
    props: { type: 'signup' },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={AuthenticationButton} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'AuthenticationButton'
