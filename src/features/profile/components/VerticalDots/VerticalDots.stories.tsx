import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { theme } from 'theme'

import { VerticalDots } from './VerticalDots'

const meta: ComponentMeta<typeof VerticalDots> = {
  title: 'features/profile/VerticalDots',
  component: VerticalDots,
}
export default meta

const Template: ComponentStory<typeof VerticalDots> = (props) => (
  <View style={{ width: props.parentWidth, height: props.parentHeight }}>
    <VerticalDots {...props} />
  </View>
)

const Multiple: ComponentStory<typeof VerticalDots> = (props) => {
  return (
    <View>
      <Template {...props} />
      <Template {...props} />
    </View>
  )
}

const Automatic: ComponentStory<typeof VerticalDots.Auto> = (props) => (
  <View style={styles.automaticWrapper}>
    <VerticalDots.Auto {...props} />
  </View>
)

export const Default = Template.bind({})
Default.args = {
  dotSize: 8,
  minimumDotSpacing: 4,
  parentWidth: 30,
  parentHeight: 200,
  endsWithDot: true,
}
Default.parameters = {
  docs: {
    description: {
      story: 'This is a simple example where all dots are rounded.',
    },
  },
}

export const WithCustomColor = Template.bind({})
WithCustomColor.args = {
  ...Default.args,
  dotColor: theme.colors.secondary,
}
WithCustomColor.parameters = {
  docs: {
    description: {
      story: 'You can change dot color.',
    },
  },
}

export const WithObjectDotSize = Template.bind({})
WithObjectDotSize.args = {
  ...Default.args,
  dotSize: { height: 8, width: 6 },
}
WithObjectDotSize.parameters = {
  docs: {
    description: {
      story: 'If you want a special shape you can give an object to `dotSize` instead of a number.',
    },
  },
}

export const WithCustomDotSize = Template.bind({})
WithCustomDotSize.args = {
  ...Default.args,
  dotSize: { height: 8, width: 6 },
  firstDotSize: { height: 7, width: 6 },
  lastDotSize: { height: 7, width: 6 },
}
WithCustomDotSize.parameters = {
  docs: {
    description: {
      story: 'An example where you can give custom sizes to the first and last dots.',
    },
  },
}

export const WithTwo = Multiple.bind({})
WithTwo.args = {
  ...Default.args,
  endsWithDot: false,
}
WithTwo.parameters = {
  docs: {
    description: {
      story:
        'An example where there is two `<VerticalDots />` following, so it shows how it is correctly spaced.',
    },
  },
}

export const AutomaticDots = Automatic.bind({})
AutomaticDots.args = {
  dotSize: 4,
  endsWithDot: true,
}
AutomaticDots.argTypes = {
  // @ts-expect-error Storybook canvas does not work well, it should not show those props
  parentHeight: { control: { disable: true } },
  parentWidth: { control: { disable: true } },
}

const styles = StyleSheet.create({
  automaticWrapper: {
    backgroundColor: theme.colors.greyLight,
    alignItems: 'center',
    width: 30,
    height: 100,
  },
})
