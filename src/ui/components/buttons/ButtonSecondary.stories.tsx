import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

import { ButtonSecondary } from './ButtonSecondary'

const meta: Meta<typeof ButtonSecondary> = {
  title: 'ui/buttons/ButtonSecondary',
  component: ButtonSecondary,
}
export default meta

const variantConfig: Variants<typeof ButtonSecondary> = [
  // Default
  {
    label: 'ButtonSecondary default',
    props: { wording: 'Confirmer' },
  },
  {
    label: 'ButtonSecondary default disabled',
    props: { wording: 'Confirmer', disabled: true },
  },
  {
    label: 'ButtonSecondary default loading',
    props: { wording: 'Confirmer', isLoading: true },
  },
  {
    label: 'ButtonSecondary default with icon',
    props: { wording: 'Confirmer', icon: Email },
  },
  {
    label: 'ButtonSecondary default disabled with icon',
    props: { wording: 'Confirmer', disabled: true, icon: Email },
  },
  // Tall
  {
    label: 'ButtonSecondary tall',
    props: { wording: 'Confirmer', buttonHeight: 'tall' },
  },
  {
    label: 'ButtonSecondary tall disabled',
    props: { wording: 'Confirmer', buttonHeight: 'tall', disabled: true },
  },
  {
    label: 'ButtonSecondary tall loading',
    props: { wording: 'Confirmer', buttonHeight: 'tall', isLoading: true },
  },
  {
    label: 'ButtonSecondary tall with icon',
    props: { wording: 'Confirmer', buttonHeight: 'tall', icon: Email },
  },
  {
    label: 'ButtonSecondary tall disabled with icon',
    props: { wording: 'Confirmer', buttonHeight: 'tall', disabled: true, icon: Email },
  },
  // Extra small
  {
    label: 'ButtonSecondary extra small',
    props: { wording: 'Confirmer', buttonHeight: 'extraSmall' },
  },
  {
    label: 'ButtonSecondary extra small disabled',
    props: { wording: 'Confirmer', buttonHeight: 'extraSmall', disabled: true },
  },
  {
    label: 'ButtonSecondary extra small loading',
    props: { wording: 'Confirmer', buttonHeight: 'extraSmall', isLoading: true },
  },
  {
    label: 'ButtonSecondary extra small with icon',
    props: { wording: 'Confirmer', buttonHeight: 'extraSmall', icon: Email },
  },
  {
    label: 'ButtonSecondary extra small disabled with icon',
    props: { wording: 'Confirmer', buttonHeight: 'extraSmall', disabled: true, icon: Email },
  },
]

export const Template: VariantsStory<typeof ButtonSecondary> = {
  name: 'ButtonSecondary',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={ButtonSecondary} defaultProps={props} />
  ),
}
