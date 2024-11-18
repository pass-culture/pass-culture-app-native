import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'

import { CheckboxBlock } from './CheckboxBlock'

const meta: ComponentMeta<typeof CheckboxBlock> = {
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

const variantConfig = [
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

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={CheckboxBlock} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'CheckboxBlock'
