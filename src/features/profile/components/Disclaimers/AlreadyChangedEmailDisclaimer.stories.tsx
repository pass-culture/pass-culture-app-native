import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { AlreadyChangedEmailDisclaimer } from './AlreadyChangedEmailDisclaimer'

const meta: ComponentMeta<typeof AlreadyChangedEmailDisclaimer> = {
  title: 'features/profile/disclaimers/AlreadyChangedEmailDisclaimer',
  component: AlreadyChangedEmailDisclaimer,
}
export default meta

const variantConfig = [
  {
    label: 'AlreadyChangedEmailDisclaimer',
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={AlreadyChangedEmailDisclaimer} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'AlreadyChangedEmailDisclaimer'
