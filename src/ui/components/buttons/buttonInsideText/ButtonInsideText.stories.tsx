import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { ButtonInsideTexteProps } from 'ui/components/buttons/buttonInsideText/types'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'

import { ButtonInsideText } from './ButtonInsideText'

const meta: Meta<typeof ButtonInsideText> = {
  title: 'ui/buttons/ButtonInsideText',
  component: ButtonInsideText,
}
export default meta

const variantConfig: Variants<typeof ButtonInsideText> = [
  {
    label: 'ButtonInsideText inactive',
    props: { wording: 'wording' },
  },
  {
    label: 'ButtonInsideText inactive disabled',
    props: { wording: 'wording', icon: ExternalSiteFilled },
  },
  {
    label: 'ButtonInsideText active',
    props: {
      wording: 'wording',
      typography: 'BodyAccentXs',
    },
  },
  {
    label: 'ButtonInsideText active disabled',
    props: {
      wording: 'wording',
      typography: 'BodyAccentXs',
      icon: ExternalSiteFilled,
    },
  },
]

const RandomText = (props: ButtonInsideTexteProps) => {
  const startText = 'Lorem ipsum dolor '
  const endText = ' sit amet consectetur adipisicing elit.'
  const TypoComponent = props.typography ? Typo[props.typography] : Typo.Body

  return (
    <TypoComponent>
      {startText}
      <ButtonInsideText {...props} />
      {endText}
    </TypoComponent>
  )
}

export const Template: VariantsStory<typeof RandomText> = {
  name: 'ButtonInsideText',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={RandomText} defaultProps={props} />
  ),
}
