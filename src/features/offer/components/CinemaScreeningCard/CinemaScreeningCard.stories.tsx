import type { Meta } from '@storybook/react-vite'
import React from 'react'
import { action } from 'storybook/actions'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { CinemaScreeningCardBase } from './CinemaScreeningCardBase'
import { CinemaScreeningCardDisabledReason } from './types'

const meta: Meta<typeof CinemaScreeningCardBase> = {
  title: 'features/offer/CinemaScreeningCard',
  component: CinemaScreeningCardBase,
}

export default meta

const variants: Variants<typeof CinemaScreeningCardBase> = [
  {
    label: 'Default',
  },
  {
    label: 'Highlight tag',
    props: { specialEvent: 'Avant-première équipe' },
  },
  {
    label: 'Video and audio tags',
    props: { video: ['DolbyVision'], audio: ['Auro3D'] },
  },
  {
    label: 'Accessibility',
    props: {
      accessibility: {
        visual: ['value'],
        audio: ['GRETA', 'CCAP'],
        mental: ['value'],
        motor: ['value'],
      },
    },
  },
  {
    label: 'Complete',
    props: {
      specialEvent: 'Avant-première équipe',
      video: ['DolbyVision'],
      audio: ['Auro3D'],
      accessibility: {
        visual: ['value'],
        audio: ['GRETA', 'CCAP'],
        mental: ['value'],
        motor: ['value'],
      },
    },
  },
  {
    label: 'Hover',
    props: {
      hovered: true,
      specialEvent: 'Avant-première équipe',
      video: ['DolbyVision'],
      audio: ['Auro3D'],
      accessibility: { visual: ['value'], audio: ['GRETA'] },
    },
  },
  {
    label: 'Disabled unavailable',
    props: { disabledReason: CinemaScreeningCardDisabledReason.UNAVAILABLE },
  },
  {
    label: 'Disabled insufficient credit',
    props: { disabledReason: CinemaScreeningCardDisabledReason.INSUFFICIENT_CREDIT },
  },
]

export const Template: VariantsStory<typeof CinemaScreeningCardBase> = {
  name: 'CinemaScreeningCard',
  render: (props) => (
    <VariantsTemplate
      variants={variants}
      Component={CinemaScreeningCardBase}
      defaultProps={{
        ...props,
        time: '17h',
        languages: ['VO'],
        price: '25€',
        onPress: action('pressed'),
      }}
    />
  ),
}
