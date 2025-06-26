import { Meta } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { theme } from 'theme'
import { Typo } from 'ui/theme'

import { Step } from '../Step/Step'

import { StepList } from './StepList'

const meta: Meta<typeof StepList> = {
  title: 'features/profile/StepList',
  component: StepList,
  args: {
    currentStepIndex: 0,
  },
  argTypes: {
    children: { control: { disable: true } },
  },
}
export default meta

const styles = StyleSheet.create({
  contentActive: {
    borderColor: theme.designSystem.color.border.focused,
  },
  content: {
    borderColor: theme.designSystem.color.border.default,
    borderWidth: 2,
    borderStyle: 'solid',
    borderRadius: 4,
    height: 100,
    padding: 24,
    marginVertical: 12,
  },
})

export function UsageExample({ currentStepIndex = 0 }) {
  return (
    <StepList currentStepIndex={currentStepIndex}>
      <Step>
        <View style={[styles.content, currentStepIndex === 0 && styles.contentActive]}>
          <Typo.Body>Play with</Typo.Body>
        </View>
      </Step>
      <Step>
        <View style={[styles.content, currentStepIndex === 1 && styles.contentActive]}>
          <Typo.Body>`currentStepIndex` control</Typo.Body>
        </View>
      </Step>
      <Step>
        <View style={[styles.content, currentStepIndex === 2 && styles.contentActive]}>
          <Typo.Body>on Storybook</Typo.Body>
        </View>
      </Step>
    </StepList>
  )
}
