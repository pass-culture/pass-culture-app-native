import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { BicolorEverywhere } from 'ui/svg/icons/BicolorEverywhere'
import { Bulb } from 'ui/svg/icons/Bulb'
import { Spacer, TypoDS } from 'ui/theme'

import { GenericBanner } from './GenericBanner'

const meta: ComponentMeta<typeof GenericBanner> = {
  title: 'ui/banners/GenericBanner',
  component: GenericBanner,
}

export default meta

const textExample = ({ withSubtitle = true }) => (
  <React.Fragment>
    <TypoDS.Button>Géolocalise-toi</TypoDS.Button>
    <Spacer.Column numberOfSpaces={1} />
    {withSubtitle ? (
      <TypoDS.Body numberOfLines={2}>Pour trouver des offres autour de toi.</TypoDS.Body>
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

const Template: VariantsStory<typeof GenericBanner> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={GenericBanner} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'GenericBanner'
