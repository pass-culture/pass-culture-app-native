import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { PlaylistArrowButton } from './PlaylistArrowButton'

const meta: Meta<typeof PlaylistArrowButton> = {
  title: 'ui/buttons/PlaylistArrowButton',
  component: PlaylistArrowButton,
}
export default meta

const variantConfig: Variants<typeof PlaylistArrowButton> = [
  {
    label: 'PlaylistArrowButton left',
    props: { direction: 'left', top: theme.designSystem.size.spacing.xl },
    minHeight: theme.designSystem.size.spacing.xxxl,
  },
  {
    label: 'PlaylistArrowButton  right',
    props: { direction: 'right', top: theme.designSystem.size.spacing.xl },
    minHeight: theme.designSystem.size.spacing.xxxl,
  },
]

export const Template: VariantsStory<typeof PlaylistArrowButton> = {
  name: 'PlaylistArrowButton',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={PlaylistArrowButton}
      defaultProps={{ ...props }}
    />
  ),
}
