import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, VariantsStory } from 'ui/storybook/VariantsTemplate'

import { EditableField } from './EditableField'

const meta: Meta<typeof EditableField> = {
  title: 'Features/Profile/EditableField',
  component: EditableField,
}
export default meta

const variantConfig: Variants<typeof EditableField> = [
  {
    label: 'EditableField with value',
    props: { label: 'Label', value: 'Value' },
  },
  {
    label: 'EditableField with value editable',
    props: { label: 'Label', value: 'Value', navigateTo: 'ChangeCity' },
  },
  {
    label: 'EditableField without value editable',
    props: { label: 'Label', navigateTo: 'ChangeCity' },
  },
]

export const Template: VariantsStory<typeof EditableField> = {
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={EditableField} defaultProps={props} />
  ),
  name: 'EditableField',
}
