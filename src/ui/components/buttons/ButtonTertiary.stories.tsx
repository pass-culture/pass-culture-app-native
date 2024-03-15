import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ButtonTertiaryNeutralInfo } from 'ui/components/buttons/ButtonTertiaryNeutralInfo'
import { ButtonTertiaryPrimary } from 'ui/components/buttons/ButtonTertiaryPrimary'
import { ButtonTertiaryWhite } from 'ui/components/buttons/ButtonTertiaryWhite'
import { StoryContainer } from 'ui/storybook/StoryContainer'
import { EditPen } from 'ui/svg/icons/EditPen'
import { Email } from 'ui/svg/icons/Email'

const meta: ComponentMeta<typeof ButtonTertiaryPrimary> = {
  title: 'ui/buttons/ButtonTertiary',
  component: ButtonTertiaryPrimary,
  argTypes: {
    icon: selectArgTypeFromObject({
      Email,
      EditPen,
    }),
  },
}
export default meta

const Template: ComponentStory<typeof ButtonTertiaryPrimary> = (props) => (
  <React.Fragment>
    <StoryContainer title="ButtonTertiaryBlack">
      <ButtonTertiaryBlack {...props} />
    </StoryContainer>
    <StoryContainer title="ButtonTertiaryNeutralInfo">
      <ButtonTertiaryNeutralInfo {...props} />
    </StoryContainer>
    <StoryContainer title="ButtonTertiaryWhite" withBackground>
      <ButtonTertiaryWhite {...props} />
    </StoryContainer>
    <StoryContainer title="ButtonTertiaryPrimary">
      <ButtonTertiaryPrimary {...props} />
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
      code: '<ButtonTertiaryPrimary wording="Confirmer" />',
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
      code: '<ButtonTertiaryPrimary wording="Confirmer" isLoading />',
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
      code: '<ButtonTertiaryPrimary wording="Confirmer" buttonHeight="tall" />',
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
      code: '<ButtonTertiaryPrimary wording="Confirmer" icon={Email} />',
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
      code: '<ButtonTertiaryPrimary wording="Confirmer" disabled={true} icon={Email} />',
    },
  },
}
