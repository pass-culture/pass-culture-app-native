import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { theme } from 'theme'
import { LinkInsideTextProps } from 'ui/components/buttons/linkInsideText/types'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Typo } from 'ui/theme'

import { LinkInsideText } from './LinkInsideText'

const meta: Meta<typeof LinkInsideText> = {
  title: 'ui/buttons/LinkInsideText',
  component: LinkInsideText,
}
export default meta

const variantConfig: Variants<typeof LinkInsideText> = [
  {
    label: 'LinkInsideText default',
    props: { wording: 'wording' },
  },
  {
    label: 'LinkInsideText default with custom color',
    props: { wording: 'wording', color: theme.designSystem.color.text.brandSecondary },
  },
  {
    label: 'LinkInsideText BodyAccentXs',
    props: { wording: 'wording', typography: 'BodyAccentXs' },
  },
  {
    label: 'LinkInsideText BodyAccentXs with custom color',
    props: {
      wording: 'wording',
      typography: 'BodyAccentXs',
      color: theme.designSystem.color.text.brandSecondary,
    },
  },
]

const RandomText = (props: LinkInsideTextProps) => {
  const startText = 'Lorem ipsum dolor '
  const endText = ' sit amet consectetur adipisicing elit.'
  const TypoComponent = props.typography ? Typo[props.typography] : Typo.Body

  return (
    <TypoComponent>
      {startText}
      <LinkInsideText {...props} />
      {endText}
    </TypoComponent>
  )
}

export const Template: VariantsStory<typeof RandomText> = {
  name: 'LinkInsideText',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={RandomText} defaultProps={props} />
  ),
}
