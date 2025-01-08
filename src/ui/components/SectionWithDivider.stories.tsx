import { ComponentMeta } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { TypoDS } from 'ui/theme'

import { SectionWithDivider } from './SectionWithDivider'

const meta: ComponentMeta<typeof SectionWithDivider> = {
  title: 'ui/sections/SectionWithDivider',
  component: SectionWithDivider,
}
export default meta

const SectionContent: React.JSX.Element = (
  <View>
    <TypoDS.Title4>Section with divider</TypoDS.Title4>
    <TypoDS.Body>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate quas aut laborum, dolor
      sapiente quos doloribus sequi reprehenderit ullam porro rem corrupti libero repellendus nam
      vel suscipit consequuntur blanditiis omnis.
    </TypoDS.Body>
  </View>
)

const variantConfig: Variants<typeof SectionWithDivider> = [
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

const Template: VariantsStory<typeof SectionWithDivider> = (args) => (
  <VariantsTemplate
    variants={variantConfig}
    Component={SectionWithDivider}
    defaultProps={{ ...args }}
  />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'SectionWithDivider'
