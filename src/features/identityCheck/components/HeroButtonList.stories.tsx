import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { HeroButtonList } from 'features/identityCheck/components/HeroButtonList'
import { BicolorSmartphone } from 'ui/svg/icons/BicolorSmartphone'

export default {
  title: 'Features/HeroButtonList',
  component: HeroButtonList,
} as ComponentMeta<typeof HeroButtonList>

const Template: ComponentStory<typeof HeroButtonList> = (props) => <HeroButtonList {...props} />

export const Default = Template.bind({})
Default.args = {
  title: "J'ai une carte d'identité ou un passeport français",
  icon: BicolorSmartphone,
}
