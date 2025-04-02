import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'

import { CheckboxBlock } from './CheckboxBlock'

const meta: Meta<typeof CheckboxBlock> = {
  title: 'ui/CheckboxBlock',
  component: CheckboxBlock,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig: Variants<typeof CheckboxBlock> = [
  {
    label: 'CheckboxBlock unchecked',
    props: {
      label: 'Label',
      checked: false,
    },
  },
  {
    label: 'CheckboxBlock checked',
    props: {
      label: 'Label',
      checked: true,
    },
  },
  {
    label: 'CheckboxBlock with sub label',
    props: {
      label: 'Label',
      checked: false,
      sublabel: 'Sublabel',
    },
  },
  {
    label: 'CheckboxBlock with left icon',
    props: {
      label: 'Label',
      checked: false,
      LeftIcon: BicolorAroundMe,
    },
  },
  {
    label: 'CheckboxBlock with sub label and left icon',
    props: {
      label: 'Label',
      checked: false,
      sublabel: 'Sublabel',
      LeftIcon: BicolorAroundMe,
    },
  },
]

export const Template: VariantsStory<typeof CheckboxBlock> = {
  name: 'CheckboxBlock',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={CheckboxBlock} defaultProps={props} />
  ),
}
