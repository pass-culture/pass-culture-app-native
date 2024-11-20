import { action } from '@storybook/addon-actions'
import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { RightButtonText } from './RightButtonText'

const meta: ComponentMeta<typeof RightButtonText> = {
  title: 'ui/RightButtonText',
  component: RightButtonText,
}
export default meta

const variantConfig: Variants<typeof RightButtonText> = [
  {
    label: 'RightButtonText quit',
    props: { wording: 'Quitter', onClose: action('close') },
  },
  {
    label: 'RightButtonText close',
    props: { wording: 'Fermer', onClose: action('close') },
  },
  {
    label: 'RightButtonText cancel',
    props: { wording: 'Annuler', onClose: action('close') },
  },
]

const Template: VariantsStory<typeof RightButtonText> = () => (
  <VariantsTemplate variants={variantConfig} Component={RightButtonText} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'RightButtonText'
