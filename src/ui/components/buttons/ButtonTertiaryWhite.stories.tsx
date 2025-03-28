import type { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

import { ButtonTertiaryWhite } from './ButtonTertiaryWhite'

const meta: Meta<typeof ButtonTertiaryWhite> = {
  title: 'ui/buttons/ButtonTertiaryWhite',
  component: ButtonTertiaryWhite,
}
export default meta

const variantConfig: Variants<typeof ButtonTertiaryWhite> = [
  // Default
  {
    label: 'ButtonTertiaryWhite default',
    props: { wording: 'Confirmer' },
    withBackground: true,
  },
  {
    label: 'ButtonTertiaryWhite default disabled',
    props: { wording: 'Confirmer', disabled: true },
    withBackground: true,
  },
  {
    label: 'ButtonTertiaryWhite default loading',
    props: { wording: 'Confirmer', isLoading: true },
    withBackground: true,
  },
  {
    label: 'ButtonTertiaryWhite default with icon',
    props: { wording: 'Confirmer', icon: Email },
    withBackground: true,
  },
  {
    label: 'ButtonTertiaryWhite default disabled with icon',
    props: { wording: 'Confirmer', disabled: true, icon: Email },
    withBackground: true,
  },
]

const Template: VariantsStory<typeof ButtonTertiaryWhite> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={ButtonTertiaryWhite} defaultProps={args} />
)

export const AllVariants = Template.bind({})
