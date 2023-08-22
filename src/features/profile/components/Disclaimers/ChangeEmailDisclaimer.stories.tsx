import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { ChangeEmailDisclaimer } from './ChangeEmailDisclaimer'

const meta: ComponentMeta<typeof ChangeEmailDisclaimer> = {
  title: 'features/profile/disclaimers/ChangeEmailDisclaimer',
  component: ChangeEmailDisclaimer,
}
export default meta

export const Template: ComponentStory<typeof ChangeEmailDisclaimer> = () => (
  <ChangeEmailDisclaimer />
)
Template.storyName = 'ChangeEmailDisclaimer'
