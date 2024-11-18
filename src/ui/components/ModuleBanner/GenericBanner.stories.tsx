import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
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

const variantConfig = [
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
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={GenericBanner} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'GenericBanner'
