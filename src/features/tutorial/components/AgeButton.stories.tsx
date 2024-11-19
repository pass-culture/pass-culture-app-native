import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { TutorialTypes } from 'features/tutorial/enums'
import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { All } from 'ui/svg/icons/bicolor/All'
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

const meta: ComponentMeta<typeof AgeButton> = {
  title: 'features/tutorial/AgeButton',
  component: AgeButton,
  argTypes: {
    Icon: selectArgTypeFromObject({
      BicolorAll,
      NoIcon: undefined,
    }),
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
      j’ai <Typo.ButtonTextSecondary>17 ans</Typo.ButtonTextSecondary>
    </StyledBody>
    {withSubtitle ? (
      <React.Fragment>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.CaptionNeutralInfo numberOfLines={2}>
          j’ai moins de 15 ans ou plus de 18 ans
        </Typo.CaptionNeutralInfo>
      </React.Fragment>
    ) : null}
  </React.Fragment>
)

const variantConfig: Variants<typeof AgeButton> = [
  {
    label: 'AgeButton default',
    props: {
      children: TextExample({}),
      navigateTo: { screen: 'AgeSelection', params: { type: TutorialTypes.ONBOARDING } },
    },
  },
  {
    label: 'AgeButton dense',
    props: {
      children: TextExample({}),
      navigateTo: { screen: 'AgeSelection', params: { type: TutorialTypes.ONBOARDING } },
      dense: true,
    },
  },
  {
    label: 'AgeButton with subtitle',
    props: {
      children: TextExample({ withSubtitle: true }),
      navigateTo: { screen: 'AgeSelection', params: { type: TutorialTypes.ONBOARDING } },
    },
  },
  {
    label: 'AgeButton dense with subtitle',
    props: {
      children: TextExample({ withSubtitle: true }),
      navigateTo: { screen: 'AgeSelection', params: { type: TutorialTypes.ONBOARDING } },
      dense: true,
    },
  },
  {
    label: 'AgeButton with icon',
    props: {
      children: TextExample({}),
      navigateTo: { screen: 'AgeSelection', params: { type: TutorialTypes.ONBOARDING } },
      Icon: <BicolorAll />,
    },
  },
  {
    label: 'AgeButton with subtitle and icon',
    props: {
      children: TextExample({ withSubtitle: true }),
      navigateTo: { screen: 'AgeSelection', params: { type: TutorialTypes.ONBOARDING } },
      Icon: <BicolorAll />,
    },
  },
  {
    label: 'AgeButton dense with subtitle and icon',
    props: {
      children: TextExample({ withSubtitle: true }),
      navigateTo: { screen: 'AgeSelection', params: { type: TutorialTypes.ONBOARDING } },
      dense: true,
      Icon: <BicolorAll />,
    },
  },
]

const Template: VariantsStory<typeof AgeButton> = (args) => (
  <VariantsTemplate variants={variantConfig} Component={AgeButton} defaultProps={{ ...args }} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'AgeButton'

// export const DenseWithoutIcon = Template.bind({})
// DenseWithoutIcon.args = {
//   children: TextExample({}),
//   dense: true,
//   Icon: undefined,
//   navigateTo: { screen: 'AgeSelection', params: { type: TutorialTypes.ONBOARDING } },
// }
