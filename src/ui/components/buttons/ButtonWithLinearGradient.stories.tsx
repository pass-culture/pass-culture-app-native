import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ButtonWithLinearGradient } from './ButtonWithLinearGradient'

export default {
  title: 'ui/buttons/ButtonWithLinearGradient',
  component: ButtonWithLinearGradient,
} as ComponentMeta<typeof ButtonWithLinearGradient>

const Template: ComponentStory<typeof ButtonWithLinearGradient> = (props) => (
  <ButtonWithLinearGradient {...props} />
)

export const Default = Template.bind({})

Default.args = {
  wording: 'Confirmer',
}

export const ExternalLink = Template.bind({})

ExternalLink.args = {
  wording: 'Ouvrir le lien',
  isExternal: true,
}

export const Disabled = Template.bind({})

Disabled.args = {
  wording: 'Confirmer',
  isDisabled: true,
}
