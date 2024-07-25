import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { ButtonQuaternarySecondary } from 'ui/components/buttons/ButtonQuarternarySecondary'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { ButtonQuaternaryGrey } from 'ui/components/buttons/ButtonQuaternaryGrey'
import { ButtonQuaternaryPrimary } from 'ui/components/buttons/ButtonQuaternaryPrimary'
import { StoryContainer } from 'ui/storybook/StoryContainer'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

const meta: ComponentMeta<typeof ButtonQuaternaryPrimary> = {
  title: 'ui/buttons/ButtonQuaternary',
  component: ButtonQuaternaryPrimary,
  argTypes: {
    icon: selectArgTypeFromObject({
      Email,
      EditPen,
    }),
  },
}
export default meta

const Template: ComponentStory<typeof ButtonQuaternaryPrimary> = (props) => (
  <React.Fragment>
    <StoryContainer title="ButtonQuaternaryBlack">
      <ButtonQuaternaryBlack {...props} />
    </StoryContainer>
    <StoryContainer title="ButtonQuaternaryGrey">
      <ButtonQuaternaryGrey {...props} />
    </StoryContainer>
    <StoryContainer title="ButtonQuaternaryPrimary">
      <ButtonQuaternaryPrimary {...props} />
    </StoryContainer>
    <StoryContainer title="ButtonQuaternarySecondary">
      <ButtonQuaternarySecondary {...props} />
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
      code: '<ButtonQuaternaryPrimary wording="Confirmer" />',
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
      code: '<ButtonQuaternaryPrimary wording="Confirmer" isLoading />',
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
      code: '<ButtonQuaternaryPrimary wording="Confirmer" buttonHeight="tall" />',
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
      code: '<ButtonQuaternaryPrimary wording="Confirmer" icon={Email} />',
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
      code: '<ButtonQuaternaryPrimary wording="Confirmer" disabled={true} icon={Email} />',
    },
  },
}
