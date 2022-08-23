import { ComponentStory } from '@storybook/react'
import React from 'react'

import { GreyDarkCaption } from './GreyDarkCaption'

export default {
  title: 'Fondations/CustomTypo',
}

const Template: ComponentStory<typeof GreyDarkCaption> = (props) => <GreyDarkCaption {...props} />

export const Caption = Template.bind({})
Caption.storyName = 'GreyDarkCaption'
Caption.args = {
  children: 'GreyDarkCaption',
}
