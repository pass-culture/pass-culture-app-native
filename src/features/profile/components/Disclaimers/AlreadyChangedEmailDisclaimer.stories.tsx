import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { AlreadyChangedEmailDisclaimer } from './AlreadyChangedEmailDisclaimer'

export default {
  title: 'features/profile/disclaimers/AlreadyChangedEmailDisclaimer',
  component: AlreadyChangedEmailDisclaimer,
} as ComponentMeta<typeof AlreadyChangedEmailDisclaimer>

// TODO(PC-17931): Fix this story
const Template: ComponentStory<typeof AlreadyChangedEmailDisclaimer> = () => (
  <AlreadyChangedEmailDisclaimer />
)
Template.storyName = 'AlreadyChangedEmailDisclaimer'
