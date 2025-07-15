import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { AlreadyChangedEmailDisclaimer } from './AlreadyChangedEmailDisclaimer'

const meta: Meta<typeof AlreadyChangedEmailDisclaimer> = {
  title: 'features/profile/disclaimers/AlreadyChangedEmailDisclaimer',
  component: AlreadyChangedEmailDisclaimer,
}
export default meta

const variantConfig: Variants<typeof AlreadyChangedEmailDisclaimer> = [
  {
    label: 'AlreadyChangedEmailDisclaimer',
  },
]

export const Template: VariantsStory<typeof AlreadyChangedEmailDisclaimer> = {
  render: () => (
    <VariantsTemplate variants={variantConfig} Component={AlreadyChangedEmailDisclaimer} />
  ),
  name: 'AlreadyChangedEmailDisclaimer',
}
