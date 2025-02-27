import { NavigationContainer } from '@react-navigation/native'
import { Meta } from '@storybook/react'
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

const Template: VariantsStory<typeof EditButton> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={EditButton} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'EditButton'
