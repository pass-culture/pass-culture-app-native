import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

import { ButtonWithLinearGradient } from './ButtonWithLinearGradient'

export default {
  title: 'ui/buttons/ButtonWithLinearGradient',
  component: ButtonWithLinearGradient,
  argTypes: {
    icon: selectArgTypeFromObject({
      Email,
      EditPen,
    }),
  },
} as ComponentMeta<typeof ButtonWithLinearGradient>

const Template: ComponentStory<typeof ButtonWithLinearGradient> = (props) => (
  <ButtonWithLinearGradient {...props} />
)

export const Default = Template.bind({})
Default.args = {
  wording: 'Confirmer',
}
Default.parameters = {
  docs: {
    source: {
      code: '<ButtonWithLinearGradient wording="Confirmer" />',
    },
  },
}

export const ExternalLink = Template.bind({})
ExternalLink.args = {
  wording: 'Ouvrir le lien',
  isExternal: true,
}
ExternalLink.parameters = {
  docs: {
    source: {
      code: '<ButtonWithLinearGradient wording="Ouvrir le lien" isExternal />',
    },
  },
}

export const Disabled = Template.bind({})
Disabled.args = {
  wording: 'Confirmer',
  isDisabled: true,
}
Disabled.parameters = {
  docs: {
    source: {
      code: '<ButtonWithLinearGradient wording="Confirmer" isDisabled />',
    },
  },
}
