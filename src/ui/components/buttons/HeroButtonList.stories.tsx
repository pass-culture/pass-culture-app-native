import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'
import { Text } from 'react-native'

import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { Emoji } from 'ui/components/Emoji'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Smartphone } from 'ui/svg/icons/Smartphone'
import { Typo } from 'ui/theme'
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
  <Text>
    <Typo.Body>J’ai une carte d’identité, un passeport </Typo.Body>
    <Typo.BodyAccent>étranger</Typo.BodyAccent>
    <Typo.Body> ou un titre séjour français</Typo.Body>
  </Text>
)
const description2 = (
  <Text>
    <Typo.Body>J’ai ma pièce d’identité </Typo.Body>
    <Typo.BodyAccent>en cours de validité avec moi</Typo.BodyAccent>
  </Text>
)

const caption = (
  <Text>
    <Emoji.Warning withSpaceAfter />
    <Typo.BodyAccentXs>Les copies ne sont pas acceptées </Typo.BodyAccentXs>
  </Text>
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
