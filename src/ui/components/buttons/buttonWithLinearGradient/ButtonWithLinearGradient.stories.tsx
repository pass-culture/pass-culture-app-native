import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { Email } from 'ui/svg/icons/Email'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'

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
Default.parameters = {
  docs: {
    source: {
      code: '<ButtonWithLinearGradient wording="Confirmer" />',
    },
  },
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  wording: 'Consulter mes e-mails',
  icon: Email,
}
WithIcon.parameters = {
  docs: {
    source: {
      code: '<ButtonWithLinearGradient wording="Consulter mes e-mails" icon={Email} />',
    },
  },
}

export const WithIconAfterWording = Template.bind({})
WithIconAfterWording.args = {
  wording: 'C’est parti\u00a0!',
  icon: PlainArrowNext,
  iconAfterWording: true,
}
WithIconAfterWording.parameters = {
  docs: {
    source: {
      code: '<ButtonWithLinearGradient wording="C’est parti\u00a0!" icon={PlainArrowNext} />',
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
