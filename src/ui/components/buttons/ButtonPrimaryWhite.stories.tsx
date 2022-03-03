import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { ContainerWithBackgound } from 'ui/storybook/ContainerWithBackgound'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

export default {
  title: 'ui/buttons/ButtonPrimaryWhite',
  component: ButtonPrimaryWhite,
  argTypes: {
    icon: selectArgTypeFromObject({
      Email,
      EditPen,
    }),
  },
} as ComponentMeta<typeof ButtonPrimaryWhite>

const Template: ComponentStory<typeof ButtonPrimaryWhite> = (props) => (
  <ContainerWithBackgound>
    <ButtonPrimaryWhite {...props} />
  </ContainerWithBackgound>
)

export const Default = Template.bind({})
Default.args = {
  wording: 'Confirmer',
}
Default.parameters = {
  docs: {
    source: {
      code: '<ButtonPrimaryWhite wording="Confirmer" />',
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
      code: '<ButtonPrimaryWhite wording="Confirmer" isLoading />',
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
      code: '<ButtonPrimaryWhite wording="Confirmer" buttonHeight="tall" />',
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
      code: '<ButtonPrimaryWhite wording="Confirmer" icon={Email} />',
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
      code: '<ButtonPrimaryWhite wording="Confirmer" disabled={true} icon={Email} />',
    },
  },
}
