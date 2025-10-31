import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { DynamicInputList } from 'ui/components/inputs/DynamicInputList/DynamicInputList'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof DynamicInputList> = {
  title: 'ui/inputs/DynamicInputList',
  component: DynamicInputList,
}
export default meta

const variantConfig: Variants<typeof DynamicInputList> = [
  {
    label: 'DynamicInputList default',
    props: {
      inputs: [{ label: 'Label 1' }, { label: 'Label 2' }, { label: 'Label 3' }],
      addMoreInputWording: 'Ajouter un champs',
    },
  },
  {
    label: 'DynamicInputList with required indicator',
    props: {
      requiredIndicator: 'explicit',
      inputs: [{ label: 'Label 1' }, { label: 'Label 2' }, { label: 'Label 3' }],
      addMoreInputWording: 'Ajouter un champs',
    },
  },
]

export const Template: VariantsStory<typeof DynamicInputList> = {
  name: 'DynamicInputList',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={DynamicInputList} defaultProps={props} />
  ),
}
