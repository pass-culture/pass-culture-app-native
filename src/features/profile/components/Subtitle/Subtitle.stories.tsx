import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { Subtitle } from './Subtitle'

const meta: ComponentMeta<typeof Subtitle> = {
  title: 'features/profile/Subtitle',
  component: Subtitle,
}
export default meta

const variantConfig = [
  {
    label: 'Subtitle',
    props: { startSubtitle: 'Subtitle' },
  },
  {
    label: 'Subtitle WithBoldEndSubtitle',
    props: { startSubtitle: 'Subtitle', boldEndSubtitle: 'with bold subtitle' },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={Subtitle} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'Subtitle'
