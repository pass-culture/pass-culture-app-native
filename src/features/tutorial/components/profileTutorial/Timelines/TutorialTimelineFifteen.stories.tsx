import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { TutorialTimelineFifteen } from './TutorialTimelineFifteen'

const meta: ComponentMeta<typeof TutorialTimelineFifteen> = {
  title: 'features/tutorial/TutorialTimelineFifteen',
  component: TutorialTimelineFifteen,
}
export default meta

const Template: ComponentStory<typeof TutorialTimelineFifteen> = () => <TutorialTimelineFifteen />
//TODO(PC-28526): Fix this stories
const Timeline = Template.bind({})
Timeline.args = {
  age: 15,
}
