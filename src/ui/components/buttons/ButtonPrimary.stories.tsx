import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

const meta: Meta<typeof ButtonPrimary> = {
  title: 'ui/buttons/ButtonPrimary',
  component: ButtonPrimary,
}
export default meta

const variantConfig: Variants<typeof ButtonPrimary> = [
  // Default
  {
    label: 'ButtonPrimary default',
    props: { wording: 'Confirmer' },
  },
  {
    label: 'ButtonPrimary default disabled',
    props: { wording: 'Confirmer', disabled: true },
  },
  {
    label: 'ButtonPrimary default loading',
    props: { wording: 'Confirmer', isLoading: true },
  },
  {
    label: 'ButtonPrimary default with icon',
    props: { wording: 'Confirmer', icon: Email },
  },
  {
    label: 'ButtonPrimary default disabled with icon',
    props: { wording: 'Confirmer', disabled: true, icon: Email },
  },
  // Tall
  {
    label: 'ButtonPrimary tall',
    props: { wording: 'Confirmer', buttonHeight: 'tall' },
  },
  {
    label: 'ButtonPrimary tall disabled',
    props: { wording: 'Confirmer', buttonHeight: 'tall', disabled: true },
  },
  {
    label: 'ButtonPrimary tall loading',
    props: { wording: 'Confirmer', buttonHeight: 'tall', isLoading: true },
  },
  {
    label: 'ButtonPrimary tall with icon',
    props: { wording: 'Confirmer', buttonHeight: 'tall', icon: Email },
  },
  {
    label: 'ButtonPrimary tall disabled with icon',
    props: { wording: 'Confirmer', buttonHeight: 'tall', disabled: true, icon: Email },
  },
  // Extra small
  {
    label: 'ButtonPrimary extra small',
    props: { wording: 'Confirmer', disabled: false, buttonHeight: 'extraSmall' },
  },
  {
    label: 'ButtonPrimary extra small disabled',
    props: { wording: 'Confirmer', buttonHeight: 'extraSmall', disabled: true },
  },
  {
    label: 'ButtonPrimary extra small loading',
    props: { wording: 'Confirmer', buttonHeight: 'extraSmall', isLoading: true },
  },
  {
    label: 'ButtonPrimary extra small with icon',
    props: { wording: 'Confirmer', buttonHeight: 'extraSmall', icon: Email },
  },
  {
    label: 'ButtonPrimary extra small disabled with icon',
    props: { wording: 'Confirmer', buttonHeight: 'extraSmall', disabled: true, icon: Email },
  },
]

export const Template: VariantsStory<typeof ButtonPrimary> = {
  name: 'ButtonPrimary',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={ButtonPrimary} defaultProps={props} />
  ),
}
