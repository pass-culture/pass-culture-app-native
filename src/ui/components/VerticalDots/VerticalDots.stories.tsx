import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { AutomaticVerticalDots } from 'ui/components/VerticalDots/AutomaticVerticalDots'

import { VerticalDots } from './VerticalDots'

const meta: Meta<typeof VerticalDots> = {
  title: 'features/profile/VerticalDots',
  component: VerticalDots,
}
export default meta

type Story = StoryObj<typeof VerticalDots>
type AutoStory = StoryObj<typeof AutomaticVerticalDots>

const TemplateRenderer = (props: React.ComponentProps<typeof VerticalDots>) => (
  <View style={{ width: props.parentWidth, height: props.parentHeight }}>
    <VerticalDots {...props} />
  </View>
)

const MultipleRenderer = (props: React.ComponentProps<typeof VerticalDots>) => (
  <View>
    <TemplateRenderer {...props} />
    <TemplateRenderer {...props} />
  </View>
)

const AutomaticRenderer = (props: React.ComponentProps<typeof AutomaticVerticalDots>) => (
  <Wrapper>
    <AutomaticVerticalDots {...props} />
  </Wrapper>
)

export const Default: Story = {
  render: (args) => <TemplateRenderer {...args} />,
  args: {
    dotSize: 8,
    parentWidth: 30,
    parentHeight: 200,
    endsWithDot: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'This is a simple example where all dots are rounded.',
      },
    },
  },
}

export const WithObjectDotSize: Story = {
  render: (args) => <TemplateRenderer {...args} />,
  args: {
    ...Default.args,
    dotSize: { height: 8, width: 6 },
  },
  parameters: {
    docs: {
      description: {
        story:
          'If you want a special shape you can give an object to `dotSize` instead of a number.',
      },
    },
  },
}

export const WithCustomDotSize: Story = {
  render: (args) => <TemplateRenderer {...args} />,
  args: {
    ...Default.args,
    dotSize: { height: 8, width: 6 },
    firstDotSize: { height: 7, width: 6 },
    lastDotSize: { height: 7, width: 6 },
  },
  parameters: {
    docs: {
      description: {
        story: 'An example where you can give custom sizes to the first and last dots.',
      },
    },
  },
}

export const WithTwo: Story = {
  render: (args) => <MultipleRenderer {...args} />,
  args: {
    ...Default.args,
    endsWithDot: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'An example where there is two `<VerticalDots />` following, so it shows how it is correctly spaced.',
      },
    },
  },
}

export const AutomaticDots: AutoStory = {
  render: (args) => <AutomaticRenderer {...args} />,
  args: {
    dotSize: 4,
    endsWithDot: true,
  },
}

const Wrapper = styled.View(({ theme }) => ({
  backgroundColor: theme.designSystem.color.background.subtle,
  alignItems: 'center',
  width: 30,
  height: 100,
}))
