import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

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

const variantConfig: Variants<typeof AuthenticationButton> = [
  {
    label: 'AuthenticationButton round price',
    props: { type: 'login' },
  },
  {
    label: 'AuthenticationButton decimal price',
    props: { type: 'signup' },
  },
]

const Template: VariantsStory<typeof AuthenticationButton> = () => (
  <VariantsTemplate variants={variantConfig} Component={AuthenticationButton} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'AuthenticationButton'
