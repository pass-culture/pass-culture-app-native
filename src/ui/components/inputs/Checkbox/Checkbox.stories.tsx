import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { Checkbox } from './Checkbox'

const meta: ComponentMeta<typeof Checkbox> = {
  title: 'ui/inputs/Checkbox',
  component: Checkbox,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig: Variants<typeof Checkbox> = [
  {
    label: 'CheckBox not checked',
    props: { label: 'I agree to disagree', isChecked: false },
  },
  {
    label: 'CheckBox checked',
    props: { label: 'I agree to disagree', isChecked: true },
  },
  {
    label: 'CheckBox required',
    props: { label: 'I have to agree', isChecked: false, required: true },
  },
]

const Template: VariantsStory<typeof Checkbox> = () => (
  <VariantsTemplate variants={variantConfig} Component={Checkbox} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'Checkbox'
