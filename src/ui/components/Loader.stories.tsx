import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { Loader } from './Loader'

const meta: ComponentMeta<typeof Loader> = {
  title: 'ui/Loader',
  component: Loader,
}
export default meta

const variantConfig = [
  {
    label: 'Loader default',
  },
  {
    label: 'Loader with message',
    props: { message: 'Chargement en cours...' },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={Loader} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'Loader'
