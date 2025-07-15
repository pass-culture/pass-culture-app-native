import type { Meta } from '@storybook/react-vite'
import React from 'react'
import { action } from 'storybook/actions'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Email } from 'ui/svg/icons/Email'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'

import { ButtonWithLinearGradientDeprecated } from './ButtonWithLinearGradientDeprecated'

const meta: Meta<typeof ButtonWithLinearGradientDeprecated> = {
  title: 'ui/buttons/ButtonWithLinearGradient',
  component: ButtonWithLinearGradientDeprecated,
}
export default meta

const variantConfig: Variants<typeof ButtonWithLinearGradientDeprecated> = [
  {
    label: 'ButtonWithLinearGradientDeprecated default',
    props: { onPress: action('press'), wording: 'Confirmer' },
  },
  {
    label: 'ButtonWithLinearGradientDeprecated disabled',
    props: {
      onPress: action('press'),
      wording: 'Confirmer',
      isDisabled: true,
    },
  },
  {
    label: 'ButtonWithLinearGradientDeprecated with fit content width',
    props: { onPress: action('press'), wording: 'Confirmer', fitContentWidth: true },
  },
  {
    label: 'ButtonWithLinearGradientDeprecated with icon',
    props: { onPress: action('press'), wording: 'Consulter mes e-mails', icon: Email },
  },
  {
    label: 'ButtonWithLinearGradientDeprecated with icon after wording',
    props: {
      onPress: action('press'),
      wording: 'C’est parti\u00a0!',
      icon: PlainArrowNext,
      iconAfterWording: true,
    },
  },
]

export const Template: VariantsStory<typeof ButtonWithLinearGradientDeprecated> = {
  name: 'ButtonWithLinearGradientDeprecated',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={ButtonWithLinearGradientDeprecated}
      defaultProps={{ ...props }}
    />
  ),
}
