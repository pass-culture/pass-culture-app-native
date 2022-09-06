/* eslint-disable react-native/no-raw-text */
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Text } from 'react-native'

import { HeroButtonList } from 'features/identityCheck/components/HeroButtonList'
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

export const Default = Template.bind({})
Default.args = {
  DescriptionContent: description,
  icon: BicolorSmartphone,
}
