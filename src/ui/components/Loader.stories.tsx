import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { Loader } from './Loader'

const meta: ComponentMeta<typeof Loader> = {
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

const Template: VariantsStory<typeof Loader> = () => (
  <VariantsTemplate variants={variantConfig} Component={Loader} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'Loader'
