import type { Meta } from '@storybook/react-vite'
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
    label: 'DropDown',
    props: { ...baseProps },
  },
  {
    label: 'DropDown with error',
    props: { ...baseProps, isError: true },
  },
  {
    label: 'DropDown with default selected value',
    props: { ...baseProps, value: CAPITALIZED_MONTHS[7] },
  },
]

export const Template: VariantsStory<typeof DropDown> = {
  name: 'DropDown',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={DropDown} defaultProps={props} />
  ),
}
