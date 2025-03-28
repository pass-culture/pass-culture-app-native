import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { StepCard } from 'features/profile/components/StepCard/StepCard'
import { StepButtonState } from 'ui/components/StepButton/types'
import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { Email } from 'ui/svg/icons/Email'
import { Typo } from 'ui/theme'

import { StepVariant } from '../VerticalStepper/types'

import { InternalStep } from './InternalStep'

const meta: Meta<typeof InternalStep> = {
  title: 'features/profile/InternalStep',
  component: InternalStep,
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof InternalStep>

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  exampleWrapper: { flexGrow: 1, backgroundColor: 'red', padding: 24 },
})

export const Complete: Story = {
  render: (props) => <InternalStep {...props} />,
  args: {
    variant: StepVariant.complete,
    children: (
      <View style={styles.exampleWrapper}>
        <Typo.Body>Example text</Typo.Body>
        <Typo.Body>Example text</Typo.Body>
        <Typo.Body>Example text</Typo.Body>
        <Typo.Body>Example text</Typo.Body>
      </View>
    ),
  },
}

export const InProgress: Story = {
  render: (props) => <InternalStep {...props} />,
  args: {
    ...Complete.args,
    variant: StepVariant.in_progress,
  },
}

export const Future: Story = {
  render: (props) => <InternalStep {...props} />,
  args: {
    ...Complete.args,
    variant: StepVariant.future,
  },
}

export const WithActiveStepCard: Story = {
  render: (props) => <InternalStep {...props} />,
  args: {
    variant: StepVariant.in_progress,
    children: <StepCard title="Active" icon={<BicolorAroundMe />} subtitle="Renseigne ton texte" />,
  },
}

export const WithDoneStepCard: Story = {
  render: (props) => <InternalStep {...props} />,
  args: {
    variant: StepVariant.complete,
    children: <StepCard title="Done" icon={<Email />} type={StepButtonState.COMPLETED} />,
  },
}

export const WithDisabledStepCard: Story = {
  render: (props) => <InternalStep {...props} />,
  args: {
    variant: StepVariant.future,
    children: <StepCard title="Disabled" icon={<Email />} type={StepButtonState.DISABLED} />,
  },
}
