import { Meta } from '@storybook/react'
import React from 'react'

import { CAPITALIZED_MONTHS } from 'shared/date/months'
import { DropDown } from 'ui/components/inputs/DropDown/DropDown'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof DropDown> = {
  title: 'ui/inputs/DropDown',
  component: DropDown,
}
export default meta

const baseProps = {
  label: 'Mois',
  placeholder: 'Mois',
  options: [...CAPITALIZED_MONTHS],
}

const variantConfig: Variants<typeof DropDown> = [
  {
    label: 'DateInput',
    props: { ...baseProps },
  },
  {
    label: 'DateInput with error',
    props: { ...baseProps, isError: true },
  },
  {
    label: 'DateInput with default selected value',
    props: { ...baseProps, value: CAPITALIZED_MONTHS[7] },
  },
]

const Template: VariantsStory<typeof DropDown> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={DropDown} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'DropDown'
