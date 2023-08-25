import { ComponentMeta, ComponentStory } from '@storybook/react'
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

const meta: ComponentMeta<typeof StepList> = {
  title: 'features/profile/StepList',
  component: StepList,
  args: {
    activeStepIndex: 0,
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

export function UsageExample({ activeStepIndex = 0 }: StepListProps) {
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

const Template: ComponentStory<typeof StepList> = ({ activeStepIndex = 0 }) => {
  const getStepCardType = (stepIndex: number) => {
    if (stepIndex === activeStepIndex) return StepCardType.ACTIVE
    if (stepIndex < activeStepIndex) return StepCardType.DONE
    return StepCardType.DISABLED
  }

  return (
    <StepList activeStepIndex={activeStepIndex}>
      <Step>
        <StyleStepCard title="Done" icon={<Email />} type={getStepCardType(0)} />
      </Step>
      <Step>
        <StyleStepCard
          title="Active"
          subtitle="Renseigne ton email"
          icon={<BicolorAroundMe />}
          type={getStepCardType(1)}
        />
      </Step>
      <Step>
        <StyleStepCard title="Disabled" icon={<Email />} type={getStepCardType(2)} />
      </Step>
      <Step>
        <StyleStepCard title="Disabled" icon={<Email />} type={getStepCardType(3)} />
      </Step>
    </StepList>
  )
}

export const WithStepCard = Template.bind({})
WithStepCard.args = {
  activeStepIndex: 1,
}
