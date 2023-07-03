import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { RightButtonText } from './RightButtonText'

export default {
  title: 'ui/headers/RightButtonText',
  component: RightButtonText,
} as ComponentMeta<typeof RightButtonText>

const Template: ComponentStory<typeof RightButtonText> = (props) => <RightButtonText {...props} />

export const Quit = Template.bind({})
Quit.args = {
  wording: 'Quitter',
  onClose: () => 'doNothing',
}

export const Close = Template.bind({})
Close.args = {
  wording: 'Fermer',
  onClose: () => 'doNothing',
}

export const Cancel = Template.bind({})
Cancel.args = {
  wording: 'Annuler',
  onClose: () => 'doNothing',
}
