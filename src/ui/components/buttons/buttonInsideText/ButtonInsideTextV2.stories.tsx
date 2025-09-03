import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { ButtonInsideTextV2Props } from 'ui/components/buttons/buttonInsideText/types'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Typo } from 'ui/theme'

import { ButtonInsideTextV2 } from './ButtonInsideTextV2'

const meta: Meta<typeof ButtonInsideTextV2> = {
  title: 'ui/buttons/ButtonInsideTextV2',
  component: ButtonInsideTextV2,
}
export default meta

const variantConfig: Variants<typeof ButtonInsideTextV2> = [
  {
    label: 'ButtonInsideTextV2 default',
    props: { wording: 'wording' },
  },
  {
    label: 'ButtonInsideTextV2 BodyAccentXs',
    props: {
      wording: 'wording',
      typography: 'BodyAccentXs',
    },
  },
]

const RandomText = (props: ButtonInsideTextV2Props) => {
  const startText = 'Lorem ipsum dolor '
  const endText = ' sit amet consectetur adipisicing elit.'
  const TypoComponent = props.typography ? Typo[props.typography] : Typo.Body

  return (
    <TypoComponent>
      {startText}
      <ButtonInsideTextV2 {...props} />
      {endText}
    </TypoComponent>
  )
}

export const Template: VariantsStory<typeof RandomText> = {
  name: 'ButtonInsideTextV2',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={RandomText} defaultProps={props} />
  ),
}
