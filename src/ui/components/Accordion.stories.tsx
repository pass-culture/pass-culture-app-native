import { NavigationContainer } from '@react-navigation/native'
import { Meta } from '@storybook/react'
import React from 'react'

import FilterSwitch from 'ui/components/FilterSwitch'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { TypoDS } from 'ui/theme'

import { Accordion } from './Accordion'

const meta: Meta<typeof Accordion> = {
  title: 'ui/Accordion',
  component: Accordion,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const children = 'children'

const baseProps = {
  title: 'My accordion',
  children: <TypoDS.Body>{children}</TypoDS.Body>,
}

const variantConfig: Variants<typeof Accordion> = [
  {
    label: 'Accordion close',
    props: baseProps,
  },
  {
    label: 'Accordion open',
    props: { ...baseProps, defaultOpen: true },
  },
  {
    label: 'Accordion with left component',
    props: { ...baseProps, leftComponent: <FilterSwitch active toggle={() => undefined} /> },
  },
  {
    label: 'Accordion with custom title component',
    props: { ...baseProps, titleComponent: TypoDS.BodyAccent },
  },
]

const Template: VariantsStory<typeof Accordion> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={Accordion} defaultProps={{ ...args }} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'Accordion'
