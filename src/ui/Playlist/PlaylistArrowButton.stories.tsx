import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { getSpacing } from 'ui/theme'

import { PlaylistArrowButton } from './PlaylistArrowButton'

const meta: ComponentMeta<typeof PlaylistArrowButton> = {
  title: 'ui/buttons/PlaylistArrowButton',
  component: PlaylistArrowButton,
}
export default meta

const variantConfig = [
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

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={PlaylistArrowButton} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'PlaylistArrowButton'
