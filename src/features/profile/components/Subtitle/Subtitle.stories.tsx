import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { Subtitle } from './Subtitle'

const meta: Meta<typeof Subtitle> = {
  title: 'features/profile/Subtitle',
  component: Subtitle,
}
export default meta

const variantConfig: Variants<typeof Subtitle> = [
  {
    label: 'Subtitle',
    props: { startSubtitle: 'Subtitle' },
  },
  {
    label: 'Subtitle WithBoldEndSubtitle',
    props: { startSubtitle: 'Subtitle', boldEndSubtitle: 'with bold subtitle' },
  },
]

export const Template: VariantsStory<typeof Subtitle> = {
  name: 'Subtitle',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={Subtitle} defaultProps={props} />
  ),
}
