import type { Meta } from '@storybook/react-vite'
import React from 'react'
import { action } from 'storybook/actions'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { CinemaScreeningCardList } from './CinemaScreeningCardList'
import { CinemaScreeningCardProps } from './types'

const meta: Meta<typeof CinemaScreeningCardList> = {
  title: 'features/offer/CinemaScreeningCardList',
  component: CinemaScreeningCardList,
}

export default meta

const createScreening = (
  time: string,
  props: Partial<CinemaScreeningCardProps> = {}
): CinemaScreeningCardProps => ({
  time,
  languages: ['VO'],
  price: '25€',
  onPress: action(`pressed-${time}`),
  ...props,
})

const variants: Variants<typeof CinemaScreeningCardList> = [
  {
    label: 'Mixed content aligned on the complete card',
    props: {
      screenings: [
        createScreening('17h'),
        createScreening('18h', { specialEvent: 'Avant-première équipe' }),
        createScreening('19h', {
          specialEvent: 'Avant-première équipe',
          video: ['DolbyVision'],
          audio: ['Auro3D'],
          accessibility: {
            visual: ['value'],
            audio: ['GRETA'],
            mental: ['value'],
            motor: ['value'],
          },
        }),
      ],
    },
  },
  {
    label: 'Only minimal cards',
    props: {
      screenings: [createScreening('17h'), createScreening('18h'), createScreening('19h')],
    },
  },
]

export const Template: VariantsStory<typeof CinemaScreeningCardList> = {
  name: 'CinemaScreeningCardList',
  render: () => <VariantsTemplate variants={variants} Component={CinemaScreeningCardList} />,
}
