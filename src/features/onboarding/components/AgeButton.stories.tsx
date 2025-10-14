import type { Meta } from '@storybook/react-vite'
import React from 'react'
import styled from 'styled-components/native'

import { getOnboardingPropConfig } from 'features/navigation/OnboardingStackNavigator/getOnboardingPropConfig'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { All as InitialAll } from 'ui/svg/icons/venueAndCategories/All'
import { Spacer, Typo } from 'ui/theme'

import { AgeButton } from './AgeButton'

const All = styled(InitialAll).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.icons.sizes.small,
}))``

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledBodyAccent = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.brandSecondary,
}))

const meta: Meta<typeof AgeButton> = {
  title: 'features/tutorial/AgeButton',
  component: AgeButton,
  argTypes: {
    Icon: {
      options: ['All', 'NoIcon'],
      mapping: {
        All: <All />,
        NoIcon: undefined,
      },
      control: {
        type: 'select',
        labels: {},
      },
    },
  },
}
export default meta

const TextExample = ({ withSubtitle = false }) => (
  <React.Fragment>
    <StyledBody>
      j’ai <StyledBodyAccent>17 ans</StyledBodyAccent>
    </StyledBody>
    {withSubtitle ? (
      <React.Fragment>
        <Spacer.Column numberOfSpaces={1} />
        <StyledBodyAccentXs numberOfLines={2}>
          j’ai moins de 15 ans ou plus de 18 ans
        </StyledBodyAccentXs>
      </React.Fragment>
    ) : null}
  </React.Fragment>
)

const variantConfig: Variants<typeof AgeButton> = [
  {
    label: 'AgeButton default',
    props: {
      children: TextExample({}),
      navigateTo: getOnboardingPropConfig('OnboardingAgeSelectionFork'),
    },
  },
  {
    label: 'AgeButton dense',
    props: {
      children: TextExample({}),
      navigateTo: getOnboardingPropConfig('OnboardingAgeSelectionFork'),
      dense: true,
    },
  },
  {
    label: 'AgeButton with subtitle',
    props: {
      children: TextExample({ withSubtitle: true }),
      navigateTo: getOnboardingPropConfig('OnboardingAgeSelectionFork'),
    },
  },
  {
    label: 'AgeButton dense with subtitle',
    props: {
      children: TextExample({ withSubtitle: true }),
      navigateTo: getOnboardingPropConfig('OnboardingAgeSelectionFork'),
      dense: true,
    },
  },
  {
    label: 'AgeButton with icon',
    props: {
      children: TextExample({}),
      navigateTo: getOnboardingPropConfig('OnboardingAgeSelectionFork'),
      Icon: <All />,
    },
  },
  {
    label: 'AgeButton with subtitle and icon',
    props: {
      children: TextExample({ withSubtitle: true }),
      navigateTo: getOnboardingPropConfig('OnboardingAgeSelectionFork'),
      Icon: <All />,
    },
  },
  {
    label: 'AgeButton dense with subtitle and icon',
    props: {
      children: TextExample({ withSubtitle: true }),
      navigateTo: getOnboardingPropConfig('OnboardingAgeSelectionFork'),
      dense: true,
      Icon: <All />,
    },
  },
]

export const Template: VariantsStory<typeof AgeButton> = {
  name: 'AgeButton',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={AgeButton} defaultProps={{ ...props }} />
  ),
}
