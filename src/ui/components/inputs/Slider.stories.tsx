import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { Slider } from './Slider'

const meta: Meta<typeof Slider> = {
  title: 'ui/inputs/Slider',
  component: Slider,
}
export default meta

const variantConfig: Variants<typeof Slider> = [
  {
    label: 'Slider',
  },
  {
    label: 'Slider with values',
    props: { values: [100], max: 300, showValues: true },
  },
  {
    label: 'Slider with min and max values',
    props: {
      values: [50],
      max: 100,
      showValues: false,
      shouldShowMinMaxValues: true,
      minMaxValuesComplement: `\u00a0km`,
    },
  },
  {
    label: 'Slider with formatted values',
    props: { values: [50], min: 20, showValues: true, formatValues: (n: number) => `${n} km` },
  },
  {
    label: 'Slider with custom step',
    props: {
      values: [50],
      min: 20,
      step: 10,
      showValues: true,
    },
  },
  {
    label: 'Multislider',
    props: {
      values: [0, 75],
      showValues: true,
      formatValues: (n: number) => `${n}\u00a0€`,
    },
  },
  {
    label: 'Multislider with overlap',
    props: {
      values: [50, 50],
      showValues: true,
      formatValues: (n: number) => `${n}\u00a0€`,
    },
  },
]

export const Template: VariantsStory<typeof Slider> = {
  name: 'Slider',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={Slider} defaultProps={{ ...props }} />
  ),
}
