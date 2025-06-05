import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Typo } from 'ui/theme'

import { CheckboxDeprecated } from './CheckboxDeprecated'

const meta: Meta<typeof CheckboxDeprecated> = {
  title: 'ui/inputs/CheckboxDeprecated',
  component: CheckboxDeprecated,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig: Variants<typeof CheckboxDeprecated> = [
  {
    label: 'CheckboxDeprecated not checked',
    props: { label: 'I agree to disagree', isChecked: false },
  },
  {
    label: 'CheckboxDeprecated checked',
    props: { label: 'I agree to disagree', isChecked: true },
  },
  {
    label: 'CheckboxDeprecated required',
    props: { label: 'I have to agree', isChecked: false, required: true },
  },
  {
    label: 'CheckboxDeprecated customised style',
    props: {
      label: 'I have to agree',
      isChecked: true,
      style: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
      LabelComponent: Typo.Title1,
    },
  },
]

export const Template: VariantsStory<typeof CheckboxDeprecated> = {
  name: 'CheckboxDeprecated',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={CheckboxDeprecated}
      defaultProps={props}
    />
  ),
}
