import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

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

const variantConfig = [
  {
    label: 'EditButton',
    props: {
      wording: 'Modifier',
      accessibilityLabel: 'Modifier e-mail',
    },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={EditButton} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'EditButton'
