import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

import { ButtonQuaternaryPrimary } from './ButtonQuaternaryPrimary'

const meta: Meta<typeof ButtonQuaternaryPrimary> = {
  title: 'ui/buttons/ButtonQuaternaryPrimary',
  component: ButtonQuaternaryPrimary,
}
export default meta

const variantConfig: Variants<typeof ButtonQuaternaryPrimary> = [
  {
    label: 'ButtonQuaternaryPrimary default',
    props: { wording: 'Confirmer' },
  },
  {
    label: 'ButtonQuaternaryPrimary default disabled',
    props: { wording: 'Confirmer', disabled: true },
  },
  {
    label: 'ButtonQuaternaryPrimary default loading',
    props: { wording: 'Confirmer', isLoading: true },
  },
  {
    label: 'ButtonQuaternaryPrimary default with icon',
    props: { wording: 'Confirmer', icon: Email },
  },
  {
    label: 'ButtonQuaternaryPrimary default disabled with icon',
    props: { wording: 'Confirmer', disabled: true, icon: Email },
  },
]

export const Template: VariantsStory<typeof ButtonQuaternaryPrimary> = {
  name: 'ButtonQuaternaryPrimary',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={ButtonQuaternaryPrimary}
      defaultProps={props}
    />
  ),
}
