import { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'

import { StepCard } from 'features/profile/components/StepCard/StepCard'
import { theme } from 'theme'
import { StepButtonState } from 'ui/components/StepButton/types'
import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { Email } from 'ui/svg/icons/Email'
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
    borderColor: theme.colors.black,
  },
  content: {
    borderColor: theme.colors.greyMedium,
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

const StyleStepCard = styled(StepCard)({
  marginVertical: 12,
})

const Template = ({ currentStepIndex = 0 }) => {
  const getStepButtonState = (stepIndex: number) => {
    if (stepIndex === currentStepIndex) return StepButtonState.CURRENT
    if (stepIndex < currentStepIndex) return StepButtonState.COMPLETED
    return StepButtonState.DISABLED
  }

  return (
    <StepList currentStepIndex={currentStepIndex}>
      <Step>
        <StyleStepCard title="Done" icon={<Email />} type={getStepButtonState(0)} />
      </Step>
      <Step>
        <StyleStepCard
          title="Active"
          subtitle="Renseigne ton e-mail"
          icon={<BicolorAroundMe />}
          type={getStepButtonState(1)}
        />
      </Step>
      <Step>
        <StyleStepCard title="Disabled" icon={<Email />} type={getStepButtonState(2)} />
      </Step>
      <Step>
        <StyleStepCard title="Disabled" icon={<Email />} type={getStepButtonState(3)} />
      </Step>
    </StepList>
  )
}

type Story = StoryObj<typeof StepList>

export const WithStepCard: Story = {
  args: {
    currentStepIndex: 1,
  },
  render: Template,
}
