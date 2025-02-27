import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import { TutorialTimelineSixteen } from './TutorialTimelineSixteen'

const meta: Meta<typeof TutorialTimelineSixteen> = {
  title: 'features/tutorial/TutorialTimelineSixteen',
  component: TutorialTimelineSixteen,
}
export default meta

const Template: StoryObj<typeof TutorialTimelineSixteen> = (props) => (
  <TutorialTimelineSixteen {...props} />
)

//TODO(PC-28526): Fix this stories
const WithoutActivation = Template.bind({})
WithoutActivation.args = {
  activatedAt: undefined,
}

//TODO(PC-28526): Fix this stories
const ActivatedAt15 = Template.bind({})
ActivatedAt15.args = {
  activatedAt: 15,
}
