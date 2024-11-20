import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { RightButtonText } from './RightButtonText'

const meta: ComponentMeta<typeof RightButtonText> = {
  title: 'ui/RightButtonText',
  component: RightButtonText,
}
export default meta

const variantConfig = [
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

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={RightButtonText} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'RightButtonText'
