import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta } from '@storybook/react'
import React from 'react'
import { Text } from 'react-native'

import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { Emoji } from 'ui/components/Emoji'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { TypoDS } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'
import { iconSizes } from 'ui/theme/iconSizes'

const meta: ComponentMeta<typeof HeroButtonList> = {
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
    <TypoDS.Body>J’ai une carte d’identité, un passeport </TypoDS.Body>
    <TypoDS.BodyAccent>étranger</TypoDS.BodyAccent>
    <TypoDS.Body> ou un titre séjour français</TypoDS.Body>
  </Text>
)
const description2 = (
  <Text>
    <TypoDS.Body>J’ai ma pièce d’identité </TypoDS.Body>
    <TypoDS.BodyAccent>en cours de validité avec moi</TypoDS.BodyAccent>
  </Text>
)

const caption = (
  <Text>
    <Emoji.Warning withSpaceAfter />
    <TypoDS.BodyAccentXs>Les copies ne sont pas acceptées </TypoDS.BodyAccentXs>
  </Text>
)

const variantConfig: Variants<typeof HeroButtonList> = [
  {
    label: 'HeroButtonList default',
    props: { Title: description, Icon: <BicolorSmartphone />, navigateTo: { screen: 'Login' } },
  },
  {
    label: 'HeroButtonList with caption',
    props: {
      Title: description2,
      Subtitle: caption,
      Icon: <BicolorSmartphone />,
      navigateTo: { screen: 'Login' },
    },
  },
  {
    label: 'HeroButtonList with custom icon',
    props: {
      Title: description2,
      Icon: (
        <LocationPointer
          color={ColorsEnum.BLACK}
          color2={ColorsEnum.BLACK}
          size={iconSizes.small}
        />
      ),
      navigateTo: { screen: 'Login' },
    },
  },
]

const Template: VariantsStory<typeof HeroButtonList> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={HeroButtonList} defaultProps={args} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'HeroButtonList'
