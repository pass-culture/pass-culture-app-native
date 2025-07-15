import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { type ComponentProps } from 'react'
import { StyleSheet, View } from 'react-native'

import { theme } from 'theme'
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
      options: ['normal', 'large', 'small'],
      mapping: { normal: 'normal', large: 'large', small: 'small' },
      control: {
        type: 'select',
        labels: { normal: 'Normal', large: 'Large', small: 'Small' },
      },
      description: 'ONLY USED IN STORYBOOK. NOT AVAILABLE IN THE COMPONENT',
    },
    iconComponent: {
      description: 'Use this if you want to override middle icon.',
      control: { disable: true },
    },
  },
}
export default meta

type Story = StoryObj<VerticalStepperStoryProps>

const WrapperTemplate = ({ wrapper = 'normal', ...props }: VerticalStepperStoryProps) => (
  <View
    style={[
      wrapper === 'normal' && styles.wrapper,
      wrapper === 'large' && styles.wrapperBig,
      wrapper === 'small' && styles.wrapperSmall,
    ]}>
    <VerticalStepper {...props} />
  </View>
)

export const Complete: Story = {
  render: (args) => WrapperTemplate(args),
  args: {
    variant: StepVariant.complete,
    wrapper: 'normal',
  },
}

export const InProgress: Story = {
  render: (args) => WrapperTemplate(args),
  args: {
    variant: StepVariant.in_progress,
    wrapper: 'normal',
  },
}

export const Future: Story = {
  render: (args) => WrapperTemplate(args),
  args: {
    variant: StepVariant.future,
    wrapper: 'normal',
  },
}

export const WithCustomComponent: Story = {
  render: (args) => WrapperTemplate(args),
  args: {
    ...Complete.args,
    // eslint-disable-next-line react-native/no-color-literals, react-native/no-inline-styles
    iconComponent: <View style={{ width: 20, height: 20, backgroundColor: 'blue' }} />,
  },
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.designSystem.color.background.subtle,
    padding: 12,
    width: 50,
    height: 200,
  },

  wrapperBig: {
    backgroundColor: theme.designSystem.color.background.subtle,
    padding: 12,
    width: 50,
    height: 500,
  },

  wrapperSmall: {
    backgroundColor: theme.designSystem.color.background.subtle,
    padding: 12,
    width: 50,
    height: 100,
  },
})
