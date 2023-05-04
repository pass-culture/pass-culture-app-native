import { ComponentMeta } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import styled from 'styled-components/native'

import { StepCard, StepCardType } from 'features/profile/components/StepCard/StepCard'
import { theme } from 'theme'
import { BicolorAroundMe } from 'ui/svg/icons/BicolorAroundMe'
import { Email } from 'ui/svg/icons/Email'
import { Typo } from 'ui/theme'

import { Step } from '../Step/Step'

import { StepList, StepListProps } from './StepList'

export default {
  title: 'features/profile/StepList',
  component: StepList,
  args: {
    activeStepIndex: 1,
  },
  argTypes: {
    children: { control: { disable: true } },
  },
} as ComponentMeta<typeof StepList>

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

export function UsageExample({ activeStepIndex }: StepListProps) {
  return (
    <StepList activeStepIndex={activeStepIndex}>
      <Step>
        <View style={[styles.content, activeStepIndex === 0 && styles.contentActive]}>
          <Typo.Body>Play with</Typo.Body>
        </View>
      </Step>
      <Step>
        <View style={[styles.content, activeStepIndex === 1 && styles.contentActive]}>
          <Typo.Body>`activeStepIndex` control</Typo.Body>
        </View>
      </Step>
      <Step>
        <View style={[styles.content, activeStepIndex === 2 && styles.contentActive]}>
          <Typo.Body>on Storybook</Typo.Body>
        </View>
      </Step>
    </StepList>
  )
}

const StyleStepCard = styled(StepCard)({
  marginVertical: 12,
})

export function WithStepCard({ activeStepIndex }: StepListProps) {
  return (
    <StepList activeStepIndex={activeStepIndex}>
      <Step>
        <StyleStepCard title="Done" icon={<Email />} type={StepCardType.DONE} />
      </Step>
      <Step>
        <StyleStepCard title="Active" subtitle="Renseigne ton email" icon={<BicolorAroundMe />} />
      </Step>
      <Step>
        <StyleStepCard title="Disabled" icon={<Email />} type={StepCardType.DISABLED} />
      </Step>
      <Step>
        <StyleStepCard title="Disabled" icon={<Email />} type={StepCardType.DISABLED} />
      </Step>
    </StepList>
  )
}
