import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { Loader } from './Loader'

const meta: Meta<typeof Loader> = {
  title: 'ui/Loader',
  component: Loader,
}
export default meta

const variantConfig: Variants<typeof Loader> = [
  {
    label: 'Loader default',
  },
  {
    label: 'Loader with message',
    props: { message: 'Chargement en cours...' },
  },
]

export const Template: VariantsStory<typeof Loader> = {
  name: 'Loader',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={Loader} defaultProps={props} />
  ),
}
