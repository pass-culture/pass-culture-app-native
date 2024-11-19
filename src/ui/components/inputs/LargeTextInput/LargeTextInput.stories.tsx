import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { LargeTextInput } from './LargeTextInput'

const meta: ComponentMeta<typeof LargeTextInput> = {
  title: 'ui/inputs/LargeTextInput',
  component: LargeTextInput,
}
export default meta

const textWith801Character = 'a'.repeat(801)

const baseProps = { label: 'Label', placeholder: 'Placeholder...' }

const variantConfig = [
  {
    label: 'LargeTextInput',
    props: { ...baseProps },
  },
  {
    label: 'LargeTextInput with value',
    props: { ...baseProps, value: 'Value...' },
  },
  {
    label: 'Required LargeTextInput',
    props: { ...baseProps, isRequiredField: true },
  },
  {
    label: 'Disabled LargeTextInput',
    props: { ...baseProps, disabled: true },
  },
  {
    label: ' LargeTextInput with Error',
    props: { ...baseProps, isError: true, showErrorMessage: true, value: textWith801Character },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={LargeTextInput} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'LargeTextInput'
