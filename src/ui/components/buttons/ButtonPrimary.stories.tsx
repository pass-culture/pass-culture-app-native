import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { StoryContainer } from 'ui/storybook/StoryContainer'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

import { ButtonPrimary } from './ButtonPrimary'

const meta: ComponentMeta<typeof ButtonPrimary> = {
  title: 'ui/buttons/ButtonPrimary',
  component: ButtonPrimary,
  argTypes: {
    icon: selectArgTypeFromObject({
      Email,
      EditPen,
    }),
  },
}
export default meta

const Template: ComponentStory<typeof ButtonPrimary> = (props) => (
  <React.Fragment>
    <StoryContainer title="ButtonPrimary">
      <ButtonPrimary {...props} />
    </StoryContainer>
    <StoryContainer title="ButtonPrimaryWhite" withBackground>
      <ButtonPrimaryWhite {...props} />
    </StoryContainer>
  </React.Fragment>
)

export const Default = Template.bind({})
Default.args = {
  wording: 'Confirmer',
}
Default.parameters = {
  docs: {
    source: {
      code: '<ButtonPrimary wording="Confirmer" />',
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
      code: '<ButtonPrimary wording="Confirmer" isLoading />',
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
      code: '<ButtonPrimary wording="Confirmer" buttonHeight="tall" />',
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
      code: '<ButtonPrimary wording="Confirmer" icon={Email} />',
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
      code: '<ButtonPrimary wording="Confirmer" disabled={true} icon={Email} />',
    },
  },
}
