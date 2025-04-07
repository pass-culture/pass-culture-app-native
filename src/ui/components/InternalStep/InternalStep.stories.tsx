import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { StepCard } from 'features/profile/components/StepCard/StepCard'
import { StepButtonState } from 'ui/components/StepButton/types'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'
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

const Container = styled.View({
  flexGrow: 1,
  padding: 24,
})

const Complete: Story = {
  render: (props) => <InternalStep {...props} />,
  args: {
    variant: StepVariant.complete,
    children: (
      <Container>
        <Typo.Body>Example text</Typo.Body>
        <Typo.Body>Example text</Typo.Body>
        <Typo.Body>Example text</Typo.Body>
        <Typo.Body>Example text</Typo.Body>
      </Container>
    ),
  },
}

const variantConfig: Variants<typeof InternalStep> = [
  {
    label: 'InternalStep InProgress',
    props: {
      variant: StepVariant.complete,
      children: (
        <Container>
          <Typo.Body>Example text</Typo.Body>
          <Typo.Body>Example text</Typo.Body>
          <Typo.Body>Example text</Typo.Body>
          <Typo.Body>Example text</Typo.Body>
        </Container>
      ),
    },
  },
  {
    label: 'InternalStep InProgress',
    props: {
      ...Complete.args,
      variant: StepVariant.in_progress,
    },
  },
  {
    label: 'InternalStep Future',
    props: {
      ...Complete.args,
      variant: StepVariant.future,
    },
  },
  {
    label: 'InternalStep with ActiveStepCard',
    props: {
      variant: StepVariant.in_progress,
      children: (
        <StepCard title="Active" icon={<BicolorAroundMe />} subtitle="Renseigne ton texte" />
      ),
    },
  },
  {
    label: 'InternalStep with DoneStepCard',
    props: {
      variant: StepVariant.complete,
      children: <StepCard title="Done" icon={<Email />} type={StepButtonState.COMPLETED} />,
    },
  },
  {
    label: 'InternalStep with DisabledStepCard',
    props: {
      variant: StepVariant.future,
      children: <StepCard title="Disabled" icon={<Email />} type={StepButtonState.DISABLED} />,
    },
  },
]

export const Template: VariantsStory<typeof InternalStep> = {
  name: 'InternalStep',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={InternalStep}
      defaultProps={{ ...props }}
    />
  ),
}
