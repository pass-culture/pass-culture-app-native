import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { Email } from 'ui/svg/icons/Email'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'

import { ButtonInsideText } from './ButtonInsideText'

const meta: ComponentMeta<typeof ButtonInsideText> = {
  title: 'ui/buttons/ButtonInsideText',
  component: ButtonInsideText,
  argTypes: {
    icon: selectArgTypeFromObject({
      Email,
      ExternalSiteFilled,
    }),
  },
}
export default meta

const Template: ComponentStory<typeof ButtonInsideText> = (args) => <ButtonInsideText {...args} />

export const Default = Template.bind({})
Default.args = {
  wording: 'wording',
}

export const DefaultWithIcon = Template.bind({})
DefaultWithIcon.args = {
  wording: 'wording',
  icon: ExternalSiteFilled,
}

export const Caption = Template.bind({})
Caption.args = {
  wording: 'wording',
  typography: 'Caption',
}

export const CaptionWithIcon = Template.bind({})
CaptionWithIcon.args = {
  wording: 'wording',
  typography: 'Caption',
  icon: ExternalSiteFilled,
}

const startText = 'Lorem ipsum dolor '
const endText = ' sit amet consectetur adipisicing elit.'
const RandomText = () => {
  return (
    <React.Fragment>
      <Typo.Body>
        {startText}
        <ButtonInsideText wording="default" />
        {endText}
      </Typo.Body>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Body>
        {startText}
        <ButtonInsideText wording="default with icon" icon={ExternalSiteFilled} />
        {endText}
      </Typo.Body>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Caption>
        {startText}
        <ButtonInsideText wording="caption" typography="Caption" />
        {endText}
      </Typo.Caption>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Caption>
        {startText}
        <ButtonInsideText
          wording="caption with icon"
          typography="Caption"
          icon={ExternalSiteFilled}
        />
        {endText}
      </Typo.Caption>
    </React.Fragment>
  )
}
export const InsideRandomText = RandomText.bind({})
