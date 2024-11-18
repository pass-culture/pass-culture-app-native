import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { Badge } from './Badge'

const meta: ComponentMeta<typeof Badge> = {
  title: 'ui/Badge',
  component: Badge,
}
export default meta

const variantConfig = [
  {
    label: 'Badge small number',
    props: { value: 1 },
  },
  {
    label: 'Badge big number',
    props: { value: 33 },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={Badge} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'Badge'
