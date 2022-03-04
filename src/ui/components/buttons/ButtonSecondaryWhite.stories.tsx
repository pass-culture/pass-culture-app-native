import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { ContainerWithBackgound } from 'ui/storybook/ContainerWithBackgound'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

import { ButtonSecondaryWhite } from './ButtonSecondaryWhite'

export default {
  title: 'ui/buttons/ButtonSecondaryWhite',
  component: ButtonSecondaryWhite,
  argTypes: {
    icon: selectArgTypeFromObject({
      Email,
      EditPen,
    }),
  },
} as ComponentMeta<typeof ButtonSecondaryWhite>

const Template: ComponentStory<typeof ButtonSecondaryWhite> = (props) => (
  <ContainerWithBackgound>
    <ButtonSecondaryWhite {...props} />
  </ContainerWithBackgound>
)

export const Default = Template.bind({})
Default.args = {
  wording: 'Confirmer',
}
Default.parameters = {
  docs: {
    source: {
      code: '<ButtonSecondaryWhite wording="Confirmer" />',
    },
  },
}

export const Loading = Template.bind({})
Loading.args = {
  wording: 'Confirmer',
  isLoading: true,
}
Loading.parameters = {
  docs: {
    source: {
      code: '<ButtonSecondaryWhite wording="Confirmer" isLoading />',
    },
  },
}

export const Tall = Template.bind({})
Tall.args = {
  wording: 'Confirmer',
  buttonHeight: 'tall',
}
Tall.parameters = {
  docs: {
    source: {
      code: '<ButtonSecondaryWhite wording="Confirmer" buttonHeight="tall" />',
    },
  },
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  wording: 'Confirmer',
  icon: 'Email',
}
WithIcon.parameters = {
  docs: {
    source: {
      code: '<ButtonSecondaryWhite wording="Confirmer" icon={Email} />',
    },
  },
}

export const DisabledWithIcon = Template.bind({})
DisabledWithIcon.args = {
  wording: 'Confirmer',
  icon: 'Email',
  disabled: true,
}
DisabledWithIcon.parameters = {
  docs: {
    source: {
      code: '<ButtonSecondaryWhite wording="Confirmer" disabled={true} icon={Email} />',
    },
  },
}
