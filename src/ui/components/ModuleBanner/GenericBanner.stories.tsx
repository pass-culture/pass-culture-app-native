import type { Meta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { BicolorEverywhere } from 'ui/svg/icons/BicolorEverywhere'
import { Bulb } from 'ui/svg/icons/Bulb'
import { Spacer, Typo } from 'ui/theme'

import { GenericBanner } from './GenericBanner'

const meta: Meta<typeof GenericBanner> = {
  title: 'ui/banners/GenericBanner',
  component: GenericBanner,
}

export default meta

const textExample = ({ withSubtitle = true }) => (
  <React.Fragment>
    <Typo.Button>Géolocalise-toi</Typo.Button>
    <Spacer.Column numberOfSpaces={1} />
    {withSubtitle ? (
      <Typo.Body numberOfLines={2}>Pour trouver des offres autour de toi.</Typo.Body>
    ) : null}
  </React.Fragment>
)

const variantConfig: Variants<typeof GenericBanner> = [
  {
    label: 'GenericBanner default',
    props: { children: textExample({}) },
  },
  {
    label: 'GenericBanner with left icon',
    props: { children: textExample({}), LeftIcon: <BicolorEverywhere /> },
  },
  {
    label: 'GenericBanner with custom right icon',
    props: { children: textExample({}), RightIcon: Bulb },
  },
  {
    label: 'GenericBanner active',
    props: { children: textExample({ withSubtitle: false }) },
  },
  {
    label: 'GenericBanner without right icon',
    props: { children: textExample({}), noRightIcon: true },
  },
]

export const Template: VariantsStory<typeof GenericBanner> = {
  name: 'GenericBanner',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={GenericBanner} defaultProps={props} />
  ),
}
