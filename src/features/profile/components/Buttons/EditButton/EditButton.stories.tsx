import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { EditButton } from './EditButton'

const meta: ComponentMeta<typeof EditButton> = {
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

const Template: VariantsStory<typeof EditButton> = () => (
  <VariantsTemplate variants={variantConfig} Component={EditButton} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'EditButton'
