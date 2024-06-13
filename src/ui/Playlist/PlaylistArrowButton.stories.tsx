import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { getSpacing } from 'ui/theme'

import { PlaylistArrowButton } from './PlaylistArrowButton'

const meta: ComponentMeta<typeof PlaylistArrowButton> = {
  title: 'ui/buttons/PlaylistArrowButton',
  component: PlaylistArrowButton,
}
export default meta

const Template: ComponentStory<typeof PlaylistArrowButton> = (props) => (
  <PlaylistArrowButton {...props} />
)

export const Left = Template.bind({})
Left.args = { direction: 'left', top: getSpacing(5) }

export const Right = Template.bind({})
Right.args = { direction: 'right', top: getSpacing(5) }
