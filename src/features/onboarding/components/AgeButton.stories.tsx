import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { getOnboardingNavConfig } from 'features/navigation/OnboardingStackNavigator/getOnboardingNavConfig'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { All } from 'ui/svg/icons/venueAndCategories/All'
import { Spacer, Typo } from 'ui/theme'

import { AgeButton } from './AgeButton'

const BicolorAll = styled(All).attrs(({ theme }) => ({
  color: theme.colors.primary,
  color2: theme.colors.secondary,
  size: theme.icons.sizes.small,
}))``

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const StyledBodyAccent = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.colors.secondary,
}))

const meta: Meta<typeof AgeButton> = {
  title: 'features/tutorial/AgeButton',
  component: AgeButton,
  argTypes: {
    Icon: {
      options: ['BicolorAll', 'NoIcon'],
      mapping: {
        BicolorAll: <BicolorAll />,
        NoIcon: undefined,
      },
      control: {
        type: 'select',
        labels: {},
      },
    },
  },
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
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
      navigateTo: getOnboardingNavConfig('OnboardingAgeSelectionFork'),
    },
  },
  {
    label: 'AgeButton dense',
    props: {
      children: TextExample({}),
      navigateTo: getOnboardingNavConfig('OnboardingAgeSelectionFork'),
      dense: true,
    },
  },
  {
    label: 'AgeButton with subtitle',
    props: {
      children: TextExample({ withSubtitle: true }),
      navigateTo: getOnboardingNavConfig('OnboardingAgeSelectionFork'),
    },
  },
  {
    label: 'AgeButton dense with subtitle',
    props: {
      children: TextExample({ withSubtitle: true }),
      navigateTo: getOnboardingNavConfig('OnboardingAgeSelectionFork'),
      dense: true,
    },
  },
  {
    label: 'AgeButton with icon',
    props: {
      children: TextExample({}),
      navigateTo: getOnboardingNavConfig('OnboardingAgeSelectionFork'),
      Icon: <BicolorAll />,
    },
  },
  {
    label: 'AgeButton with subtitle and icon',
    props: {
      children: TextExample({ withSubtitle: true }),
      navigateTo: getOnboardingNavConfig('OnboardingAgeSelectionFork'),
      Icon: <BicolorAll />,
    },
  },
  {
    label: 'AgeButton dense with subtitle and icon',
    props: {
      children: TextExample({ withSubtitle: true }),
      navigateTo: getOnboardingNavConfig('OnboardingAgeSelectionFork'),
      dense: true,
      Icon: <BicolorAll />,
    },
  },
]

export const Template: VariantsStory<typeof AgeButton> = {
  name: 'AgeButton',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={AgeButton} defaultProps={{ ...props }} />
  ),
}
