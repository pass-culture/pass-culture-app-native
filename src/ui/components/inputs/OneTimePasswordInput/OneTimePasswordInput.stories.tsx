import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { OneTimePasswordInput } from './OneTimePasswordInput'

const meta: Meta<typeof OneTimePasswordInput> = {
  title: 'ui/inputs/OneTimePasswordInput',
  component: OneTimePasswordInput,
  parameters: { axe: { disabledRules: ['duplicate-id-aria'] } },
}

export default meta

const baseProps = {
  label: 'Saisis le code de vérification',
  code: ['', '', '', '', '', ''],
}

const variantConfig: Variants<typeof OneTimePasswordInput> = [
  {
    label: 'OneTimePasswordInput',
    props: baseProps,
  },
  {
    label: 'OneTimePasswordInput with value',
    props: { ...baseProps, code: ['1', '2', '3', '4', '5', '6'] },
  },
  {
    label: 'OneTimePasswordInput with 4 inputs',
    props: { ...baseProps, numberOfInputs: 4, code: ['1', '2', '3', '4'] },
  },
  {
    label: 'OneTimePasswordInput with 8 inputs',
    props: { ...baseProps, numberOfInputs: 8, code: ['1', '2', '3', '4', '5', '6', '7', '8'] },
  },
  {
    label: 'OneTimePasswordInput Small',
    props: { ...baseProps, size: 'small' },
  },
  {
    label: 'OneTimePasswordInput Regular',
    props: { ...baseProps, size: 'regular' },
  },
  {
    label: 'OneTimePasswordInput Tall',
    props: { ...baseProps, size: 'tall' },
  },
  {
    label: 'OneTimePasswordInput Required explicit',
    props: { ...baseProps, requiredIndicator: 'explicit' },
  },
  {
    label: 'OneTimePasswordInput Required symbol',
    props: { ...baseProps, requiredIndicator: 'symbol' },
  },
  {
    label: 'OneTimePasswordInput with code error',
    props: { ...baseProps, code: ['1', 'A', '3', '4', 'B', '6'] },
  },
  {
    label: 'OneTimePasswordInput with customError',
    props: { ...baseProps, errorMessage: 'Erreur customisée' },
  },
  {
    label: 'OneTimePasswordInput Disabled',
    props: { ...baseProps, disabled: true },
  },
]

export const Template: VariantsStory<typeof OneTimePasswordInput> = {
  name: 'OneTimePasswordInput',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={OneTimePasswordInput}
      defaultProps={{ ...props }}
    />
  ),
}
