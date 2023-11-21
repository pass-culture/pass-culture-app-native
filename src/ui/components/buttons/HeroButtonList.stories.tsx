import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Text } from 'react-native'

import { HeroButtonList } from 'ui/components/buttons/HeroButtonList'
import { Emoji } from 'ui/components/Emoji'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { Typo } from 'ui/theme'
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
export const HeroButtonListWithCustomIconProps = Template.bind({})
HeroButtonListWithCustomIconProps.args = {
  Title: description2,
  Subtitle: caption,
  icon: LocationPointer,
  iconProps: { color: ColorsEnum.BLACK, color2: ColorsEnum.BLACK, size: iconSizes.small },
}
