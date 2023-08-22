import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import { Typo } from 'ui/theme'

import { SectionWithDivider } from './SectionWithDivider'

const meta: ComponentMeta<typeof SectionWithDivider> = {
  title: 'ui/sections/SectionWithDivider',
  component: SectionWithDivider,
}
export default meta

const Template: ComponentStory<typeof SectionWithDivider> = (props) => (
  <SectionWithDivider {...props} />
)

const SectionContent: React.JSX.Element = (
  <View>
    <Typo.Title4>Section with divider</Typo.Title4>
    <Typo.Body>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate quas aut laborum, dolor
      sapiente quos doloribus sequi reprehenderit ullam porro rem corrupti libero repellendus nam
      vel suscipit consequuntur blanditiis omnis.
    </Typo.Body>
  </View>
)

export const Default = Template.bind({})
Default.args = {
  visible: true,
  children: SectionContent,
}

export const IsNotVisible = Template.bind({})
IsNotVisible.args = {
  visible: false,
  children: SectionContent,
}

export const WithMargin = Template.bind({})
WithMargin.args = {
  visible: true,
  children: SectionContent,
  margin: true,
}
