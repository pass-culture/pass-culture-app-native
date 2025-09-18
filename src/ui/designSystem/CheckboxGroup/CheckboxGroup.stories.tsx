import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { CheckboxGroup } from './CheckboxGroup'

const meta: Meta<typeof CheckboxGroup> = {
  title: 'design system/inputs/CheckboxGroup',
  component: CheckboxGroup,
}
export default meta

const variantConfig: Variants<typeof CheckboxGroup> = [
  {
    label: 'CheckboxGroup Default',
    props: {
      label: 'CheckboxGroup label',
      value: 'CheckboxGroup value',
      variant: 'default',
    },
  },
  {
    label: 'CheckboxGroup with labelTag h1',
    props: {
      label: 'CheckboxGroup label',
      value: 'CheckboxGroup value',
      variant: 'default',
      labelTag: 'h1',
    },
  },
  {
    label: 'CheckboxGroup with labelTag h2',
    props: {
      label: 'CheckboxGroup label',
      value: 'CheckboxGroup value',
      variant: 'default',
      labelTag: 'h2',
    },
  },
  {
    label: 'CheckboxGroup with labelTag h3',
    props: {
      label: 'CheckboxGroup label',
      value: 'CheckboxGroup value',
      variant: 'default',
      labelTag: 'h3',
    },
  },
  {
    label: 'CheckboxGroup with description',
    props: {
      label: 'CheckboxGroup label',
      value: 'CheckboxGroup value',
      variant: 'default',
      description: 'CheckboxGroup description',
    },
  },
]

export const Template: VariantsStory<typeof CheckboxGroup> = {
  name: 'CheckboxGroup',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={CheckboxGroup} defaultProps={props} />
  ),
}
