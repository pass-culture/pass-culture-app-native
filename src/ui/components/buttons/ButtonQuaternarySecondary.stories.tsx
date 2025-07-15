import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'

import { ButtonQuaternarySecondary } from './ButtonQuaternarySecondary'

const meta: Meta<typeof ButtonQuaternarySecondary> = {
  title: 'ui/buttons/ButtonQuaternarySecondary',
  component: ButtonQuaternarySecondary,
}
export default meta

const variantConfig: Variants<typeof ButtonQuaternarySecondary> = [
  {
    label: 'ButtonQuaternarySecondary default',
    props: { wording: 'Confirmer' },
  },
  {
    label: 'ButtonQuaternarySecondary default disabled',
    props: { wording: 'Confirmer', disabled: true },
  },
  {
    label: 'ButtonQuaternarySecondary default loading',
    props: { wording: 'Confirmer', isLoading: true },
  },
  {
    label: 'ButtonQuaternarySecondary default with icon',
    props: { wording: 'Confirmer', icon: Email },
  },
  {
    label: 'ButtonQuaternarySecondary default disabled with icon',
    props: { wording: 'Confirmer', disabled: true, icon: Email },
  },
]

export const Template: VariantsStory<typeof ButtonQuaternarySecondary> = {
  name: 'ButtonQuaternarySecondary',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={ButtonQuaternarySecondary}
      defaultProps={props}
    />
  ),
}
