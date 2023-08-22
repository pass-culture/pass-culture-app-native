import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { AlreadyChangedEmailDisclaimer } from './AlreadyChangedEmailDisclaimer'

const meta: ComponentMeta<typeof AlreadyChangedEmailDisclaimer> = {
  title: 'features/profile/disclaimers/AlreadyChangedEmailDisclaimer',
  component: AlreadyChangedEmailDisclaimer,
}
export default meta

// TODO(PC-17931): Fix this story
const Template: ComponentStory<typeof AlreadyChangedEmailDisclaimer> = () => (
  <AlreadyChangedEmailDisclaimer />
)
Template.storyName = 'AlreadyChangedEmailDisclaimer'
