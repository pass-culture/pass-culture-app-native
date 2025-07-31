import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { Emoji } from 'ui/components/Emoji'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Smartphone } from 'ui/svg/icons/Smartphone'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { iconSizes } from 'ui/theme/iconSizes'

const meta: Meta<typeof HeroButtonList> = {
  title: 'ui/buttons/HeroButtonList',
  component: HeroButtonList,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const description = (
  <Typo.Body>
    J’ai une carte d’identité, un passeport{SPACE}
    <Typo.BodyAccent>étranger</Typo.BodyAccent>
    {SPACE}ou un titre séjour français
  </Typo.Body>
)
const description2 = (
  <Typo.Body>
    J’ai ma pièce d’identité{SPACE}
    <Typo.BodyAccent>en cours de validité avec moi</Typo.BodyAccent>
  </Typo.Body>
)

const caption = (
  <Typo.Body>
    <Emoji.Warning withSpaceAfter />
    <Typo.BodyAccentXs>Les copies ne sont pas acceptées </Typo.BodyAccentXs>
  </Typo.Body>
)

const variantConfig: Variants<typeof HeroButtonList> = [
  {
    label: 'HeroButtonList default',
    props: { Title: description, Icon: <Smartphone />, navigateTo: { screen: 'Login' } },
  },
  {
    label: 'HeroButtonList with caption',
    props: {
      Title: description2,
      Subtitle: caption,
      Icon: <Smartphone />,
      navigateTo: { screen: 'Login' },
    },
  },
  {
    label: 'HeroButtonList with custom icon',
    props: {
      Title: description2,
      Icon: <LocationPointer size={iconSizes.small} />,
      navigateTo: { screen: 'Login' },
    },
  },
]

export const Template: VariantsStory<typeof HeroButtonList> = {
  name: 'HeroButtonList',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={HeroButtonList} defaultProps={props} />
  ),
}
