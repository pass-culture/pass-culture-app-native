import type { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { getSpacing } from 'ui/theme'

import { PlaylistArrowButton } from './PlaylistArrowButton'

const meta: Meta<typeof PlaylistArrowButton> = {
  title: 'ui/buttons/PlaylistArrowButton',
  component: PlaylistArrowButton,
}
export default meta

const variantConfig: Variants<typeof PlaylistArrowButton> = [
  {
    label: 'PlaylistArrowButton left',
    props: { direction: 'left', top: getSpacing(5) },
    minHeight: getSpacing(10),
  },
  {
    label: 'PlaylistArrowButton  right',
    props: { direction: 'right', top: getSpacing(5) },
    minHeight: getSpacing(10),
  },
]

const Template: VariantsStory<typeof PlaylistArrowButton> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={PlaylistArrowButton} defaultProps={args} />
)

export const AllVariants = Template.bind({})
