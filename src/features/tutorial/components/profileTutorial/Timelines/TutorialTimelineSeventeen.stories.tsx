import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { TutorialTimelineSeventeen } from './TutorialTimelineSeventeen'

const meta: Meta<typeof TutorialTimelineSeventeen> = {
  title: 'features/tutorial/TutorialTimelineSeventeen',
  component: TutorialTimelineSeventeen,
}
export default meta

type Story = StoryObj<typeof TutorialTimelineSeventeen>

export const WithoutActivation: Story = {
  render: (props) => <TutorialTimelineSeventeen {...props} />,
  args: {
    activatedAt: undefined,
  },
}

export const ActivatedAt15: Story = {
  render: (props) => <TutorialTimelineSeventeen {...props} />,
  args: {
    activatedAt: 15,
  },
}

export const ActivatedAt16: Story = {
  render: (props) => <TutorialTimelineSeventeen {...props} />,
  args: {
    activatedAt: 16,
  },
}
