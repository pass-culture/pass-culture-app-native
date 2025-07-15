import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'ui/Badge',
  component: Badge,
}
export default meta

const variantConfig: Variants<typeof Badge> = [
  {
    label: 'Badge small number',
    props: { value: 1 },
  },
  {
    label: 'Badge big number',
    props: { value: 33 },
  },
]

export const Template: VariantsStory<typeof Badge> = {
  name: 'Badge',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={Badge} defaultProps={props} />
  ),
}
