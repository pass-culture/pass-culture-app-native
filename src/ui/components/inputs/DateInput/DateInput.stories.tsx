import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { DEFAULT_SELECTED_DATE, MAXIMUM_DATE, MINIMUM_DATE } from 'features/auth/fixtures/fixtures'
import { DateInput } from 'ui/components/inputs/DateInput/DateInput'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: ComponentMeta<typeof DateInput> = {
  title: 'ui/inputs/DateInput',
  component: DateInput,
}
export default meta

const baseProps = {
  date: DEFAULT_SELECTED_DATE,
  minimumDate: MINIMUM_DATE,
  maximumDate: MAXIMUM_DATE,
  onChange: action('change'),
}

const variantConfig: Variants<typeof DateInput> = [
  {
    label: 'DateInput',
    props: { ...baseProps },
  },
  {
    label: 'DateInput with error',
    props: { ...baseProps, errorMessage: 'Error message' },
  },
]

const Template: VariantsStory<typeof DateInput> = () => (
  <VariantsTemplate variants={variantConfig} Component={DateInput} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'DateInput'
