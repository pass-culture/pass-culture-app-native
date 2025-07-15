import type { Meta } from '@storybook/react-vite'
import React from 'react'
import { View } from 'react-native'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Typo } from 'ui/theme'

import { SectionWithDivider } from './SectionWithDivider'

const meta: Meta<typeof SectionWithDivider> = {
  title: 'ui/sections/SectionWithDivider',
  component: SectionWithDivider,
}
export default meta

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

export const Template: VariantsStory<typeof SectionWithDivider> = {
  name: 'SectionWithDivider',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={SectionWithDivider}
      defaultProps={{ ...props }}
    />
  ),
}
