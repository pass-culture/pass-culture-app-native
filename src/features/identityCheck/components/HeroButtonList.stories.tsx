import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Text } from 'react-native'

import { HeroButtonList } from 'features/identityCheck/components/HeroButtonList'
import { Emoji } from 'ui/components/Emoji'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { Typo } from 'ui/theme'

export default {
  title: 'Features/HeroButtonList',
  component: HeroButtonList,
} as ComponentMeta<typeof HeroButtonList>

const Template: ComponentStory<typeof HeroButtonList> = (props) => <HeroButtonList {...props} />

const description = (
  <Text>
    <Typo.Body>J’ai une carte d’identité, un passeport </Typo.Body>
    <Typo.ButtonText>étranger</Typo.ButtonText>
    <Typo.Body> ou un titre séjour français</Typo.Body>
  </Text>
)
const description2 = (
  <Text>
    <Typo.Body>J’ai ma pièce d’identité </Typo.Body>
    <Typo.ButtonText>en cours de validité avec moi</Typo.ButtonText>
  </Text>
)

const caption = (
  <Text>
    <Emoji.Warning withSpaceAfter />
    <Typo.Caption>Les copies ne sont pas acceptées </Typo.Caption>
  </Text>
)
export const Default = Template.bind({})
Default.args = {
  Title: description,
  icon: BicolorSmartphone,
}
export const HeroButtonListWithCaption = Template.bind({})
HeroButtonListWithCaption.args = {
  Title: description2,
  Subtitle: caption,
  icon: BicolorSmartphone,
}
