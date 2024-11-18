import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { Typo, TypoDS } from 'ui/theme'

import { SectionWithDivider } from './SectionWithDivider'

const meta: ComponentMeta<typeof SectionWithDivider> = {
  title: 'ui/sections/SectionWithDivider',
  component: SectionWithDivider,
}
export default meta

const SectionContent: React.JSX.Element = (
  <View>
    <TypoDS.Title4>Section with divider</TypoDS.Title4>
    <Typo.Body>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate quas aut laborum, dolor
      sapiente quos doloribus sequi reprehenderit ullam porro rem corrupti libero repellendus nam
      vel suscipit consequuntur blanditiis omnis.
    </Typo.Body>
  </View>
)

const variantConfig = [
  {
    label: 'SectionWithDivider default',
    props: { visible: true, children: SectionContent },
  },
  {
    label: 'SectionWithDivider not visible',
    props: { visible: false, children: SectionContent },
  },
  {
    label: 'SectionWithDivider with margin',
    props: { visible: true, children: SectionContent, margin: true },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={SectionWithDivider} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'SectionWithDivider'
