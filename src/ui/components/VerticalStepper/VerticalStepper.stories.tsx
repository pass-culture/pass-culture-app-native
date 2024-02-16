import { Meta } from '@storybook/react'
import { Story } from '@storybook/react/dist/ts3.9/client/preview/types-6-0'
import React, { ComponentProps } from 'react'
import { StyleSheet, View } from 'react-native'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { StepVariant } from 'ui/components/VerticalStepper/types'
import { VerticalStepper } from 'ui/components/VerticalStepper/VerticalStepper'

type VerticalStepperStoryProps = ComponentProps<typeof VerticalStepper> & {
  wrapper: 'normal' | 'large' | 'small'
}

const meta: Meta<VerticalStepperStoryProps> = {
  title: 'features/profile/VerticalStepper',
  component: VerticalStepper,
  argTypes: {
    variant: {
      description: `Use this prop to handle correct stepper step.

There is 3 variants available:
- \`VerticalStepperVariant.complete\` for completed step
- \`VerticalStepperVariant.in_progress\` for in-progress step
- \`VerticalStepperVariant.future\` for future step

Each one has its own styling, and it should always be only one "in-progress" step.
It may exist 0 or more completed and future steps.`,
    },
    wrapper: {
      ...selectArgTypeFromObject({ normal: 'normal', large: 'large', small: 'small' }),
      description: 'ONLY USED IN STORYBOOK. NOT AVAILABLE IN THE COMPONENT',
    },
    iconComponent: {
      description: 'Use this if you want to override middle icon.',
      control: { disable: true },
    },
  },
}
export default meta

const WrapperTemplate: Story<VerticalStepperStoryProps> = ({ wrapper = 'normal', ...props }) => (
  <View
    style={[
      wrapper === 'normal' && styles.wrapper,
      wrapper === 'large' && styles.wrapperBig,
      wrapper === 'small' && styles.wrapperSmall,
    ]}>
    <VerticalStepper {...props} />
  </View>
)

export const Complete = WrapperTemplate.bind({})
Complete.args = {
  variant: StepVariant.complete,
  wrapper: 'normal',
}

export const InProgress = WrapperTemplate.bind({})
InProgress.args = {
  variant: StepVariant.in_progress,
  wrapper: 'normal',
}

export const Future = WrapperTemplate.bind({})
Future.args = {
  variant: StepVariant.future,
  wrapper: 'normal',
}

export const WithCustomComponent = WrapperTemplate.bind({})
WithCustomComponent.args = {
  ...Complete.args,
  // eslint-disable-next-line react-native/no-color-literals, react-native/no-inline-styles
  iconComponent: <View style={{ width: 20, height: 20, backgroundColor: 'blue' }} />,
}

/**
 * extract in a variable so ESLint is happy and does not cry about color
 * in a string instead of using theme...
 */
const wrapperBackground = 'rgba(100, 100, 100, .03)'

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: wrapperBackground,
    padding: 12,
    width: 50,
    height: 200,
  },

  wrapperBig: {
    backgroundColor: wrapperBackground,
    padding: 12,
    width: 50,
    height: 500,
  },

  wrapperSmall: {
    backgroundColor: wrapperBackground,
    padding: 12,
    width: 50,
    height: 100,
  },
})
