import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react-vite'
import React from 'react'

import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

import { RadioSelector } from './RadioSelector'

const meta: Meta<typeof RadioSelector> = {
  title: 'ui/inputs/RadioSelector',
  component: RadioSelector,
  parameters: {
    docs: {
      description: {
        component:
          'It used `SelectableListItem` internally but it simplifies the process of ' +
          'creating something that looks like Figma component.\n\n' +
          'See [Figma](https://www.figma.com/file/r2DymT3uGbCrY2MZOtFYW3/App-Native---Library?type=design&node-id=8261-201601&mode=design&t=OhvbYblVKY3nu2zf-4) link',
      },
    },
  },
  argTypes: {
    onPress: { control: { disable: true } },
  },
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const baseProps = {
  label: 'Lorem ipsum dolor sit amet consectetur ac.',
  description: '1 place restante',
  rightText: `35\u00a0€`,
  disabled: false,
  checked: false,
  testID: '',
  accessibilityLabel: '',
}

const variantConfig: Variants<typeof RadioSelector> = [
  {
    label: 'Checked RadioSelector',
    props: { ...baseProps, checked: true },
  },
  {
    label: 'Disabled RadioSelector',
    props: { ...baseProps, disabled: true },
  },
  {
    label: 'RadioSelector without description',
    props: { ...baseProps, description: '' },
  },
  {
    label: 'RadioSelector without right text',
    props: {
      ...baseProps,
      rightText: '',
    },
  },
]

export const Template: VariantsStory<typeof RadioSelector> = {
  name: 'RadioSelector',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={RadioSelector}
      defaultProps={{ ...props }}
    />
  ),
}
