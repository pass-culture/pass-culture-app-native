import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { EditButton } from './EditButton'

const meta: Meta<typeof EditButton> = {
  title: 'features/profile/buttons/EditButton',
  component: EditButton,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig: Variants<typeof EditButton> = [
  {
    label: 'EditButton',
    props: {
      wording: 'Modifier',
      accessibilityLabel: 'Modifier e-mail',
    },
  },
]

export const Template: VariantsStory<typeof EditButton> = {
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={EditButton} defaultProps={props} />
  ),
  name: 'EditButton',
}
