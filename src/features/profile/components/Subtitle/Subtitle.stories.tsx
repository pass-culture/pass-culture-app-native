import { Meta } from '@storybook/react'
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

const Template: VariantsStory<typeof Subtitle> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={Subtitle} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'Subtitle'
