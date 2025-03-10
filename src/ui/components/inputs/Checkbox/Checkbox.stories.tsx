import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Typo } from 'ui/theme'

import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
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
  {
    label: 'CheckBox customised style',
    props: {
      label: 'I have to agree',
      isChecked: true,
      style: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
      LabelComponent: Typo.Title1,
    },
  },
]

const Template: VariantsStory<typeof Checkbox> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={Checkbox} defaultProps={args} />
)

export const AllVariants = Template.bind({})
