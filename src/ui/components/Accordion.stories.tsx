import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react-vite'
import React from 'react'

import FilterSwitch from 'ui/components/FilterSwitch'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { Typo } from 'ui/theme'

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
  children: <Typo.Body>{children}</Typo.Body>,
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
    props: { ...baseProps, titleComponent: Typo.BodyAccent },
  },
]

export const Template: VariantsStory<typeof Accordion> = {
  name: 'Accordion',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={Accordion} defaultProps={{ ...props }} />
  ),
}
