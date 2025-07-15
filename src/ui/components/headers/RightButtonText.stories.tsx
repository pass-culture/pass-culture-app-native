import type { Meta } from '@storybook/react-vite'
import React from 'react'
import { action } from 'storybook/actions'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { RightButtonText } from './RightButtonText'

const meta: Meta<typeof RightButtonText> = {
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

export const Template: VariantsStory<typeof RightButtonText> = {
  name: 'RightButtonText',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={RightButtonText}
      defaultProps={{ ...props }}
    />
  ),
}
