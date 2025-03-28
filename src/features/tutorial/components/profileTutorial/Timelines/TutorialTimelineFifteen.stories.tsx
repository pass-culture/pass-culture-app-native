import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { TutorialTimelineFifteen } from './TutorialTimelineFifteen'

const meta: Meta<typeof TutorialTimelineFifteen> = {
  title: 'features/tutorial/TutorialTimelineFifteen',
  component: TutorialTimelineFifteen,
}
export default meta

type Story = StoryObj<typeof TutorialTimelineFifteen>

export const Timeline: Story = {
  render: () => <TutorialTimelineFifteen />,
  args: {
    age: 15,
  },
}
