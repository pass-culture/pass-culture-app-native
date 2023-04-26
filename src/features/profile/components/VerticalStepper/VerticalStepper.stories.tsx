import { ComponentMeta } from '@storybook/react'
import { Story } from '@storybook/react/dist/ts3.9/client/preview/types-6-0'
import React, { ComponentProps } from 'react'
import { StyleSheet, View } from 'react-native'

import { VerticalStepperVariant } from 'features/profile/components/VerticalStepper/types'
import { VerticalStepper } from 'features/profile/components/VerticalStepper/VerticalStepper'

export default {
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
      type: 'select',
      options: ['normal', 'large', 'small'],
      description: 'ONLY USED IN STORYBOOK. NOT AVAILABLE IN THE COMPONENT',
    },
  },
} as ComponentMeta<typeof VerticalStepper>

const WrapperTemplate: Story<
  ComponentProps<typeof VerticalStepper> & {
    wrapper: 'normal' | 'large' | 'small'
  }
> = ({ wrapper = 'normal', ...props }) => (
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
  variant: VerticalStepperVariant.complete,
  wrapper: 'normal',
}

export const InProgress = WrapperTemplate.bind({})
InProgress.args = {
  variant: VerticalStepperVariant.in_progress,
  wrapper: 'normal',
}

export const Future = WrapperTemplate.bind({})
Future.args = {
  variant: VerticalStepperVariant.future,
  wrapper: 'normal',
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
