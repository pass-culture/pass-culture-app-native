import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { PositionFilled } from 'ui/svg/icons/PositionFilled'

import { CheckboxBlockDeprecated } from './CheckboxBlockDeprecated'

const meta: Meta<typeof CheckboxBlockDeprecated> = {
  title: 'ui/CheckboxBlockDeprecated',
  component: CheckboxBlockDeprecated,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const variantConfig: Variants<typeof CheckboxBlockDeprecated> = [
  {
    label: 'CheckboxBlockDeprecated unchecked',
    props: {
      label: 'Label',
      checked: false,
    },
  },
  {
    label: 'CheckboxBlockDeprecated checked',
    props: {
      label: 'Label',
      checked: true,
    },
  },
  {
    label: 'CheckboxBlockDeprecated with sub label',
    props: {
      label: 'Label',
      checked: false,
      sublabel: 'Sublabel',
    },
  },
  {
    label: 'CheckboxBlockDeprecated with left icon',
    props: {
      label: 'Label',
      checked: false,
      LeftIcon: PositionFilled,
    },
  },
  {
    label: 'CheckboxBlockDeprecated with sub label and left icon',
    props: {
      label: 'Label',
      checked: false,
      sublabel: 'Sublabel',
      LeftIcon: PositionFilled,
    },
  },
]

export const Template: VariantsStory<typeof CheckboxBlockDeprecated> = {
  name: 'CheckboxBlockDeprecated',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={CheckboxBlockDeprecated}
      defaultProps={props}
    />
  ),
}
