import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ChangeEmailDisclaimer } from './ChangeEmailDisclaimer'

export default {
  title: 'features/profile/disclaimers/ChangeEmailDisclaimer',
  component: ChangeEmailDisclaimer,
} as ComponentMeta<typeof ChangeEmailDisclaimer>

export const Template: ComponentStory<typeof ChangeEmailDisclaimer> = () => (
  <ChangeEmailDisclaimer />
)
Template.storyName = 'ChangeEmailDisclaimer'
