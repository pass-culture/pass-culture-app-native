import type { Meta } from '@storybook/react'
import React from 'react'

import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

const meta: Meta<typeof ButtonPrimaryWhite> = {
  title: 'ui/buttons/ButtonPrimaryWhite',
  component: ButtonPrimaryWhite,
}
export default meta

const variantConfig: Variants<typeof ButtonPrimaryWhite> = [
  // Default
  {
    label: 'ButtonPrimaryWhite default',
    props: { wording: 'Confirmer' },
    withBackground: true,
  },
  {
    label: 'ButtonPrimaryWhite default disabled',
    props: { wording: 'Confirmer', disabled: true },
    withBackground: true,
  },
  {
    label: 'ButtonPrimaryWhite default loading',
    props: { wording: 'Confirmer', isLoading: true },
    withBackground: true,
  },
  {
    label: 'ButtonPrimaryWhite default with icon',
    props: { wording: 'Confirmer', icon: Email },
    withBackground: true,
  },
  {
    label: 'ButtonPrimaryWhite default disabled with icon',
    props: { wording: 'Confirmer', disabled: true, icon: Email },
    withBackground: true,
  },
  // Tall
  {
    label: 'ButtonPrimaryWhite tall',
    props: { wording: 'Confirmer', buttonHeight: 'tall' },
    withBackground: true,
  },
  {
    label: 'ButtonPrimaryWhite tall disabled',
    props: { wording: 'Confirmer', buttonHeight: 'tall', disabled: true },
    withBackground: true,
  },
  {
    label: 'ButtonPrimaryWhite tall loading',
    props: { wording: 'Confirmer', buttonHeight: 'tall', isLoading: true },
    withBackground: true,
  },
  {
    label: 'ButtonPrimaryWhite tall with icon',
    props: { wording: 'Confirmer', buttonHeight: 'tall', icon: Email },
    withBackground: true,
  },
  {
    label: 'ButtonPrimaryWhite tall disabled with icon',
    props: { wording: 'Confirmer', buttonHeight: 'tall', disabled: true, icon: Email },
    withBackground: true,
  },
  // Extra small
  {
    label: 'ButtonPrimaryWhite extra small',
    props: { wording: 'Confirmer', disabled: false, buttonHeight: 'extraSmall' },
    withBackground: true,
  },
  {
    label: 'ButtonPrimaryWhite extra small disabled',
    props: { wording: 'Confirmer', buttonHeight: 'extraSmall', disabled: true },
    withBackground: true,
  },
  {
    label: 'ButtonPrimaryWhite extra small loading',
    props: { wording: 'Confirmer', buttonHeight: 'extraSmall', isLoading: true },
    withBackground: true,
  },
  {
    label: 'ButtonPrimaryWhite extra small with icon',
    props: { wording: 'Confirmer', buttonHeight: 'extraSmall', icon: Email },
    withBackground: true,
  },
  {
    label: 'ButtonPrimaryWhite extra small disabled with icon',
    props: { wording: 'Confirmer', buttonHeight: 'extraSmall', disabled: true, icon: Email },
    withBackground: true,
  },
]

const Template: VariantsStory<typeof ButtonPrimaryWhite> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={ButtonPrimaryWhite} defaultProps={args} />
)

export const AllVariants = Template.bind({})
